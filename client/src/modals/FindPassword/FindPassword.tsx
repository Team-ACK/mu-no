import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { TextField, Button } from "../../components";
import { modalHandleStore } from "../../store";

const CommonStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const NonContentStyle = styled(CommonStyle)`
  width: 100%;
  flex-basis: 15%;
  color: ${(props) => props.theme.typography.button};
`;
const ContentStyle = styled(CommonStyle)`
  color: gray;
  width: 100%;
  flex-basis: 19%;
  align-items: start;
`;

const InputLayoutStyle = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
`;

const S = {
  Top: styled(NonContentStyle)`
    color: #696eff;
    font-weight: 700;
    font-size: 35px;
  `,
  Bottom: styled(NonContentStyle)`
    margin-top: 20px;
  `,
  EmailLayout: styled(ContentStyle)``,
  EmailInput: styled(InputLayoutStyle)``,
};

const FindPassword = () => {
  const { removeModal } = modalHandleStore();

  const [userEmail, setUserEmail] = useState<string>("");
  const [userEmailErr, setUserEmailErr] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const userEmailHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUserEmail(e.currentTarget.value);
  };

  const onSubmit = () => {
    if (userEmail !== "") {
      setIsLoading(true);
      axios
        .post("/password/reset", { email: userEmail })
        .then((res) => {
          if (res.data.success) {
            setSuccess(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setUserEmailErr(true);
            setSuccess(false);
            setIsLoading(false);
          }
        });
    }
  };

  return (
    <>
      <S.Top>
        <p>비밀번호 찾기</p>
      </S.Top>
      {success ? (
        <>
          <p style={{ fontSize: "22px", marginBottom: "5px" }}>가입 시 입력하신 이메일로</p>
          <p style={{ fontSize: "22px" }}> 아이디 확인 메일이 발송되었습니다.</p>
          <S.Bottom>
            <Button
              style={{ width: "40%", height: "55px" }}
              onClick={() => {
                removeModal();
              }}
            >
              완료
            </Button>
          </S.Bottom>
        </>
      ) : (
        <>
          <p style={{ marginBottom: "30px" }}>비밀번호를 초기화하기 위해 이메일을 입력해주세요</p>
          <S.EmailLayout>
            <p>이메일</p>
            <S.EmailInput>
              <TextField
                style={{ width: "100%", height: "93%", marginLeft: "0px" }}
                placeholder="abcde@example.com"
                onChange={userEmailHandler}
                value={userEmail}
                disabled={isLoading}
                fieldType={userEmailErr ? "warning" : "primary"}
              />
            </S.EmailInput>
            {userEmailErr === true ? (
              <p style={{ color: "#ff3d3d", marginTop: "10px" }}>존재하지 않는 이메일입니다</p>
            ) : null}
          </S.EmailLayout>
          <S.Bottom>
            <Button disabled={isLoading} style={{ width: "100%", height: "60px" }} onClick={onSubmit}>
              {isLoading ? "잠시만 기다려주세요" : "비밀번호 찾기"}
            </Button>
          </S.Bottom>
        </>
      )}
    </>
  );
};

export default FindPassword;
