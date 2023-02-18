import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "../../../components";
import { ReactComponent as CloseImg } from "../../../assets/img/close.svg";

type Props = {
  modal: boolean;
  setModal: Function;
};

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
  /* border: 1px solid red; */
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
  Background: styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
    padding: 30px;
  `,
  Wrapper: styled.div`
    background: white;
    position: absolute;
    left: calc(100vw / 2 - 250px);
    top: calc(100vh / 2 - 350px);
    border-radius: 12px;
  `,

  InnerContainer: styled(CommonStyle)`
    /* justify-content: space-between; */
    width: 500px;
    height: 700px;
    padding: 15px 20px;
    border: 1px solid ${(props) => props.theme.palette.borderColor};
    box-shadow: 0px 0px 10px 2px ${(props) => props.theme.palette.shadowColor};
  `,

  Top: styled(NonContentStyle)`
    color: #696eff;
    font-weight: 600;
    font-size: 35px;
  `,
  CloseLayout: styled(CommonStyle)`
    width: 100%;
    align-items: flex-end;
  `,
  NicknameLayout: styled(ContentStyle)``,
  NicknameInput: styled(InputLayoutStyle)``,
  EmailLayout: styled(ContentStyle)``,
  EmailInput: styled(InputLayoutStyle)``,
  PasswordLayout: styled(ContentStyle)``,
  RePasswordLayout: styled(ContentStyle)``,
  Bottom: styled(NonContentStyle)`
    margin-top: 20px;
  `,
};

const SignUp: React.FC<Props> = ({ modal, setModal }: Props) => {
  const [scale, setScale] = useState(Math.min(window.innerWidth / 1400, window.innerHeight / 900));

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [userEmailErr, setUserEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
  const [userNameErr, setUserNameErr] = useState<0 | 1 | 2>(0);

  const onChangeUserEmail = (e: React.FormEvent<HTMLInputElement>) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (!e.currentTarget.value || emailRegex.test(e.currentTarget.value)) setUserEmailErr(false);
    else setUserEmailErr(true);
    setUserEmail(e.currentTarget.value);
  };
  const onChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordRegex = /^.{8,}$/;
    if (!e.currentTarget.value || passwordRegex.test(e.currentTarget.value)) setPasswordErr(false);
    else setPasswordErr(true);

    if (!confirmPassword || e.currentTarget.value === confirmPassword) setConfirmPasswordErr(false);
    else setConfirmPasswordErr(true);
    setPassword(e.currentTarget.value);
  };
  const onChangeConfirmPassword = (e: React.FormEvent<HTMLInputElement>) => {
    if (password === e.currentTarget.value) setConfirmPasswordErr(false);
    else setConfirmPasswordErr(true);
    setConfirmPassword(e.currentTarget.value);
  };
  // const onChangeUserName = (e: React.FormEvent<HTMLInputElement>) => {
  //   // const nicknameRegex = /^(?=.*[a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣])[a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/;
  //   // if ((!inputName || nicknameRegex.test(inputName)) && (getBytes(inputName) < 4 || getBytes(inputName) > 16)) {
  //   //   setUserNameErr(false);
  //   //   setUserName(e.currentTarget.value);

  //   const inputName = e.currentTarget.value;

  //   if (!inputName || getBytes(inputName) < 4 || getBytes(inputName) > 16) {
  //     setUserNameErr(true);
  //   } else {
  //     setUserNameErr(false);
  //     setUserName(e.currentTarget.value);
  //   }
  // };

  // 0: 정상, 1: 길이가 맞지 않는 경우, 2: 중복된 닉네임일 경우

  type CheckNickNameType = {
    nickname: string;
  };
  const onChangeUserName = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputName = e.currentTarget.value;
    if (userNameErr !== 1) {
      axios
        .post<CheckNickNameType>("/checkNickname", { nickname: inputName })
        .then((res) => {
          console.log((res as any).message);
          if ((res as any).message === "사용 가능한 닉네임입니다") {
            setUserNameErr(0);
          } else if ((res as any).message === "등록된 닉네임입니다") {
            setUserNameErr(2);
          }
        })
        .catch((err) => {
          alert((err as any).message);
        });
    }
  };

  const validation = () => {
    if (!password) setPasswordErr(true);
    if (!confirmPassword) setConfirmPasswordErr(true);
    if (!userName) setUserNameErr(1);
    if (!userEmail) setUserEmailErr(true);

    if (password && confirmPassword && userName && userEmail) {
      return true;
    }
    return false;
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    if (validation()) {
      setModal(!modal);
      return true;
    }
    alert("다시하셈");
    return false;
  };

  const getBytes = (nickname: string) => {
    let character: string;
    let charBytes = 0;

    for (let i = 0; i < nickname.length; i += 1) {
      character = nickname.charAt(i);
      if (escape(character).length > 4) charBytes += 2;
      else charBytes += 1;
    }

    return charBytes;
  };

  const handleResize = () => {
    setScale(Math.min(window.innerWidth / 1400, window.innerHeight / 900));
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <S.Background>
      <S.Wrapper style={{ transform: `scale(${scale})` }}>
        <S.InnerContainer>
          <S.CloseLayout>
            <CloseImg
              width="25px"
              height="25px"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModal(!modal);
              }}
            />
          </S.CloseLayout>
          <S.Top>
            <p>회원가입</p>
          </S.Top>
          <S.NicknameLayout>
            <p>닉네임</p>
            <S.NicknameInput>
              <TextField size="100%" style={{ marginLeft: "0px", height: "93%" }} onChange={onChangeUserName} />
              {/* <Button size="150px">
                <p style={{ fontSize: "17px" }}>중복 확인</p>
              </Button> */}
            </S.NicknameInput>
            {userNameErr && (
              <p style={{ color: "red", marginTop: "10px" }}>닉네임은 한글 2~8자, 영문 4~16자 이내로 입력해주세요</p>
            )}
          </S.NicknameLayout>

          <S.EmailLayout>
            <p>이메일</p>
            <S.EmailInput>
              <TextField
                size="100%"
                style={{ marginLeft: "0px", height: "93%" }}
                placeholder="abcde@example.com"
                onChange={onChangeUserEmail}
              />
              <Button size="150px" style={{ height: "93%" }}>
                <p style={{ fontSize: "17px" }}>중복 확인</p>
              </Button>
            </S.EmailInput>
            {userEmailErr && <p style={{ color: "red", marginTop: "10px" }}>올바르지 않은 이메일 형식 입니다</p>}
          </S.EmailLayout>
          <hr />
          <S.PasswordLayout>
            <p>비밀번호</p>
            <TextField
              size="100%"
              style={{ marginLeft: "0px", height: "50%" }}
              type="password"
              onChange={onChangePassword}
            />
            {passwordErr && <p style={{ color: "red" }}>비밀번호는 8~15자 이내로 입력해주세요</p>}
          </S.PasswordLayout>
          <S.RePasswordLayout>
            <p>비밀번호 확인</p>
            <TextField
              size="100%"
              style={{ marginLeft: "0px", height: "50%" }}
              type="password"
              onChange={onChangeConfirmPassword}
            />
            {confirmPasswordErr && (
              <p style={{ color: "red", marginTop: "2px" }}> 입력한 비밀번호가 서로 일치하지 않습니다</p>
            )}
          </S.RePasswordLayout>
          <S.Bottom>
            <Button style={{ width: "100%", height: "60px" }} onClick={onSubmit}>
              가입하기
            </Button>
          </S.Bottom>
        </S.InnerContainer>
      </S.Wrapper>
    </S.Background>
  );
};

export default SignUp;
