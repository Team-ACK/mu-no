import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "../../components";
import { modalHandleStore } from "../../store";
import { END_POINT } from "../../utils/envProvider";

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

const S = {
  Top: styled(NonContentStyle)`
    color: #696eff;
    font-weight: 700;
    font-size: 35px;
  `,
  Bottom: styled(NonContentStyle)`
    margin-top: 20px;
  `,
  PasswordLayout: styled(ContentStyle)``,
  RePasswordLayout: styled(ContentStyle)``,
};

const ResetPassword = () => {
  const { temporaryData } = modalHandleStore();

  const [passwordFirstRender, setPasswordFirstRender] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // 0: 오류 없음, 1: 비밀번호 형식 맞지 않음, 2: 만료된 토큰
  const [passwordErr, setPasswordErr] = useState<0 | 1 | 2>(0);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const passwordHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setPasswordFirstRender(e.currentTarget.value === "");
    setPassword(e.currentTarget.value);
  };
  const confirmPasswordHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const validatePassword = (): boolean => {
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordRegex = /^.{8,15}$/;
    if (passwordRegex.test(password)) {
      setPasswordErr(0);
      return true;
    }
    setPasswordErr(1);
    return false;
  };

  const validateConfirmPassword = (): boolean => {
    if (password === confirmPassword) {
      setConfirmPasswordErr(false);
      return true;
    }
    setConfirmPasswordErr(true);
    return false;
  };

  useEffect(() => {
    const timeid = setTimeout(() => {
      validatePassword();
    }, 300);
    return () => {
      clearTimeout(timeid);
    };
  }, [password]); // eslint-disable-line

  useEffect(() => {
    const timeid = setTimeout(() => {
      validateConfirmPassword();
    }, 300);
    return () => {
      clearTimeout(timeid);
    };
  }, [confirmPassword]); // eslint-disable-line

  const validation = () => {
    if (validatePassword() && validateConfirmPassword()) {
      return true;
    }
    return false;
  };

  const onSubmit = () => {
    if (validation()) {
      setIsLoading(true);
      axios
        .put(`${END_POINT}/password/reset`, { code: temporaryData, password })
        .then((res) => {
          if (res.data.success) {
            setSuccess(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setPasswordErr(2);
            setSuccess(false);
            setIsLoading(false);
          }
        });
    }
  };

  return (
    <>
      <S.Top>{success ? <p>비밀번호 변경 완료</p> : <p>비밀번호 변경</p>}</S.Top>
      {success ? (
        <>
          <p style={{ fontSize: "22px", marginBottom: "5px" }}>비밀번호 변경이 완료되었습니다.</p>
          <p style={{ fontSize: "22px" }}> 새로운 비밀번호로 로그인해주세요.</p>
          <S.Bottom>
            <Button
              style={{ width: "40%", height: "55px" }}
              onClick={() => {
                window.location.replace("/");
              }}
            >
              로그인 화면으로
            </Button>
          </S.Bottom>
        </>
      ) : (
        <>
          <S.PasswordLayout>
            <p>새로운 비밀번호</p>
            <TextField
              disabled={isLoading}
              style={{ height: "50%", width: "100%", marginLeft: "0px" }}
              type="password"
              onChange={passwordHandler}
              value={password}
              fieldType={!passwordFirstRender && passwordErr ? "warning" : "primary"}
            />
            {!passwordFirstRender && passwordErr === 1 ? (
              <p style={{ color: "#ff3d3d" }}>비밀번호는 8~15자 이내로 입력해주세요</p>
            ) : !passwordFirstRender && passwordErr === 2 ? (
              <p style={{ color: "#ff3d3d" }}>비밀번호 변경 기한이 만료되었습니다</p>
            ) : null}
          </S.PasswordLayout>
          <S.RePasswordLayout>
            <p>비밀번호 확인</p>
            <TextField
              disabled={isLoading}
              style={{ height: "50%", width: "100%", marginLeft: "0px" }}
              type="password"
              onChange={confirmPasswordHandler}
              value={confirmPassword}
              fieldType={confirmPasswordErr ? "warning" : "primary"}
            />
            {confirmPasswordErr && (
              <p style={{ color: "#ff3d3d", marginTop: "2px" }}> 입력한 비밀번호가 서로 일치하지 않습니다</p>
            )}
          </S.RePasswordLayout>

          <S.Bottom>
            <Button disabled={isLoading} style={{ width: "100%", height: "60px" }} onClick={onSubmit}>
              {isLoading ? "잠시만 기다려주세요" : "비밀번호 변경"}
            </Button>
          </S.Bottom>
        </>
      )}
    </>
  );
};

export default ResetPassword;
