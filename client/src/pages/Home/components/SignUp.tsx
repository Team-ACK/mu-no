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

  const [userNamefirstRender, setUserNameFirstRender] = useState(true);
  const [finishCheckEmail, setFinishCheckEmail] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [passwordErr, setPasswordErr] = useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);
  const [userEmailErr, setUserEmailErr] = useState<0 | 1 | 2>(0);
  const [userNameErr, setUserNameErr] = useState<0 | 1 | 2>(0);

  const passwordHandler = (e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value);
  const confirmPasswordHandler = (e: React.FormEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value);
  const userNameHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUserNameFirstRender(false);
    setUserName(e.currentTarget.value);
  };
  const userEmailHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUserEmail(e.currentTarget.value);
  };

  const validatePassword = () => {
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordRegex = /^.{8,15}$/;
    if (!password || passwordRegex.test(password)) setPasswordErr(false);
    else setPasswordErr(true);
  };

  const validateConfirmPassword = () => {
    if (password === confirmPassword) setConfirmPasswordErr(false);
    else setConfirmPasswordErr(true);
  };

  const checkUserEmailDuplicate = async (): Promise<boolean> => {
    const response = await axios.get(`/checkEmail?email=${userEmail}`);
    return response.data.isDuplicate;
  };

  const checkUserEmailHandler = async () => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i; // eslint-disable-line
    if (userEmail && userEmailErr !== 1 && emailRegex.test(userEmail)) {
      const isDuplicate = await checkUserEmailDuplicate();
      if (isDuplicate) {
        setUserEmailErr(2);
      } else {
        setUserEmailErr(0);
        setFinishCheckEmail(true);
      }
    }
  };

  const validateUserEmail = () => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i; // eslint-disable-line
    if (!userEmail || emailRegex.test(userEmail)) setUserEmailErr(0);
    else {
      setUserEmailErr(1);
    }
  };

  const checkUserNameDuplicate = async (): Promise<boolean> => {
    const response = await axios.get(`/checkNickname?nickname=${userName}`);
    return response.data.isDuplicate;
  };

  const validateUserName = async () => {
    // const nicknameRegex = /^(?=.*[a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣])[a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]$/
    if (!userName || getBytes(userName) < 4 || getBytes(userName) > 16) {
      setUserNameErr(1);
    } else {
      const isDuplicate = await checkUserNameDuplicate();
      if (isDuplicate) {
        setUserNameErr(2);
      } else {
        setUserNameErr(0);
      }
    }
  };

  useEffect(() => {
    const timeid = setTimeout(() => {
      validateUserName();
    }, 300);
    return () => {
      clearTimeout(timeid);
    };
  }, [userName]); // eslint-disable-line

  useEffect(() => {
    const timeid = setTimeout(() => {
      validateUserEmail();
    }, 300);
    return () => {
      clearTimeout(timeid);
    };
  }, [userEmail]); // eslint-disable-line

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
    validateUserEmail();
    validatePassword();
    validateConfirmPassword();
    validateUserName();

    if (userEmailErr && userNameErr && passwordErr && confirmPasswordErr && !finishCheckEmail) {
      return true;
    }
    setUserNameFirstRender(false);
    return false;
  };

  const onSubmit = () => {
    if (validation()) {
      axios
        .post("/signup", { nickname: userName, email: userEmail, password })
        .then((res) => {
          if (res.data.message === "success") {
            setModal(!modal);
            alert("회원가입 성공!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    alert("다시하셈");
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
              <TextField
                size="100%"
                style={{ marginLeft: "0px", height: "93%" }}
                onChange={userNameHandler}
                value={userName}
                red={!userNamefirstRender && userNameErr !== 0}
              />
            </S.NicknameInput>
            {!userNamefirstRender && userNameErr === 1 ? (
              <p style={{ color: "#ff3d3d", marginTop: "10px" }}>
                닉네임은 한글 2~8자, 영문 4~16자 이내로 입력해주세요
              </p>
            ) : !userNamefirstRender && userNameErr === 2 ? (
              <p style={{ color: "#ff3d3d", marginTop: "10px" }}>중복된 닉네임 입니다</p>
            ) : !userNamefirstRender && userNameErr === 0 ? (
              <p style={{ color: "#54d154", marginTop: "10px" }}>사용 가능한 닉네임 입니다</p>
            ) : null}
          </S.NicknameLayout>

          <S.EmailLayout>
            <p>이메일</p>
            <S.EmailInput>
              {finishCheckEmail ? (
                <TextField
                  size="100%"
                  style={{ marginLeft: "0px", height: "93%", backgroundColor: "#ebebeb" }}
                  placeholder="abcde@example.com"
                  onChange={userEmailHandler}
                  readOnly
                  disabled
                  value={userEmail}
                />
              ) : (
                <TextField
                  size="100%"
                  style={{ marginLeft: "0px", height: "93%" }}
                  placeholder="abcde@example.com"
                  onChange={userEmailHandler}
                  value={userEmail}
                  red={userEmailErr}
                />
              )}

              {finishCheckEmail ? (
                <Button
                  style={{ width: "150px", height: "93%", cursor: "default", backgroundColor: "#b8baff" }}
                  onClick={checkUserEmailHandler}
                  disabled
                >
                  <p style={{ fontSize: "17px" }}>확인 완료</p>
                </Button>
              ) : (
                <Button style={{ width: "150px", height: "93%" }} onClick={checkUserEmailHandler}>
                  <p style={{ fontSize: "17px" }}>중복 확인</p>
                </Button>
              )}
            </S.EmailInput>
            {userEmailErr === 1 ? (
              <p style={{ color: "#ff3d3d", marginTop: "10px" }}>올바르지 않은 이메일 형식 입니다</p>
            ) : userEmailErr === 2 ? (
              <p style={{ color: "#ff3d3d", marginTop: "10px" }}>중복된 이메일 입니다</p>
            ) : null}
          </S.EmailLayout>
          <hr />
          <S.PasswordLayout>
            <p>비밀번호</p>
            <TextField
              size="100%"
              style={{ marginLeft: "0px", height: "50%" }}
              type="password"
              onChange={passwordHandler}
              value={password}
              red={passwordErr}
            />
            {passwordErr && <p style={{ color: "#ff3d3d" }}>비밀번호는 8~15자 이내로 입력해주세요</p>}
          </S.PasswordLayout>
          <S.RePasswordLayout>
            <p>비밀번호 확인</p>
            <TextField
              size="100%"
              style={{ marginLeft: "0px", height: "50%" }}
              type="password"
              onChange={confirmPasswordHandler}
              value={confirmPassword}
              red={confirmPasswordErr}
            />
            {confirmPasswordErr && (
              <p style={{ color: "#ff3d3d", marginTop: "2px" }}> 입력한 비밀번호가 서로 일치하지 않습니다</p>
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
