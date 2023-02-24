import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Profile, Button } from "../../../components";
import { userStore, socketStore } from "../../../store";

const LayoutStyle = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.palette.black};
  border-radius: 12px;
  height: 87.8%;
`;

const LoginFormStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 12px;
`;

const FlexAlignStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const S = {
  LoginForm: styled(LayoutStyle)`
    justify-content: space-between;
    flex-direction: column;
    flex-basis: 59.5%;
  `,
  GameDescriptionLayout: styled(LayoutStyle)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 37.4%;
  `,
  TabLayout: styled(LoginFormStyle)`
    display: flex;
    flex-basis: 12.2%;
  `,
  ProfileWrapper: styled(LoginFormStyle)`
    flex-basis: 43%;
  `,
  SubmitLayout: styled(LoginFormStyle)`
    flex-basis: 20%;
  `,
  ProfileImgLayout: styled.div`
    width: 80.6%;
    display: flex;
  `,
  ProfileImgSection: styled(FlexAlignStyle)`
    flex-basis: 35%;
  `,
  NicknameSection: styled(FlexAlignStyle)`
    flex-direction: row;
    flex-basis: 65%;
  `,
  NicknameInfo: styled.h2`
    margin-bottom: 5px;
    ${(props) => props.theme.typography.information};
  `,
  GuestTabButton: styled(FlexAlignStyle)`
    cursor: pointer;
    ${(props) => props.theme.typography.information};
    width: 100%;
    height: 100%;
    background-color: ${({ tabToggle }: { tabToggle: "guest" | "member" }) => (tabToggle === "guest" ? "#fafafa" : "")};
    box-shadow: ${({ tabToggle }: { tabToggle: "guest" | "member" }) =>
      tabToggle === "guest" ? "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset" : ""};
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 12px 0 0 0;
  `,
  MemberTabButton: styled(FlexAlignStyle)`
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    ${(props) => props.theme.typography.information};
    width: 100%;
    height: 100%;
    background-color: ${({ tabToggle }: { tabToggle: "guest" | "member" }) =>
      tabToggle === "member" ? "#fafafa" : ""};
    box-shadow: ${({ tabToggle }: { tabToggle: "guest" | "member" }) =>
      tabToggle === "member" ? "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset" : ""};
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0 12px 0 0;
  `,

  TabInfo: styled(FlexAlignStyle)`
    ${(props) => props.theme.typography.information};
    width: 100%;
    height: 31px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  `,
  TextFieldWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  Nav: styled.nav`
    display: flex;
    margin: 5px 0px 0px;
  `,
  NavItem: styled.a`
    text-decoration: none;
    cursor: pointer;
    font-size: 13px;
    color: #4e4e4e;
  `,
  Hr: styled.hr`
    border: none;
    width: 1px;
    height: 13px;
    margin: 0 3px;
    background-color: darkgray;
  `,
};

const MainElement = ({
  modal,
  setModal,
  paramRoomCode,
}: {
  modal: boolean;
  setModal: Function;
  paramRoomCode: string | undefined;
}) => {
  const navigate = useNavigate();
  const { setRoomCode, setNickname, setUserColor, setIsHost } = userStore();
  const { socket } = socketStore();

  const generateRandNickname = (min: number, max: number): string => {
    return `익명${(Math.random() * (max - min) + min).toFixed()}`;
  };

  const generateRandColor = (): string => {
    const colorR = Math.floor(Math.random() * 127 + 128).toString(16);
    const colorG = Math.floor(Math.random() * 127 + 128).toString(16);
    const colorB = Math.floor(Math.random() * 127 + 128).toString(16);
    return `#${colorR + colorG + colorB}`;
  };

  const [tabToggle, setTabToggle] = useState<"guest" | "member">("guest");

  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  const [annonNickname] = useState(generateRandNickname(1000, 9999));

  const [profileColor] = useState(generateRandColor());

  const [inputRoomCode, setInputRoomCode] = useState("");
  const [inputUserNickname, setInputUserNickname] = useState("");

  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const [loginedUserNickname, setLoginedUserNickname] = useState<string>("");

  const inputEmailHandler = (e: React.FormEvent<HTMLInputElement>) => setInputEmail(e.currentTarget.value);
  const inputPasswordHandler = (e: React.FormEvent<HTMLInputElement>) => setInputPassword(e.currentTarget.value);

  const onSubmit = () => {
    if (inputEmail && inputPassword) {
      axios.post("/signin", { email: inputEmail, password: inputPassword }).then((res) => {
        if (res.data.success) {
          setLoginFailed(false);
          setLoginSuccess(true);
          setLoginedUserNickname(res.data.message);
        } else {
          setLoginFailed(true);
          setInputPassword("");
        }
      });
    }
  };

  const createRoom = () => {
    setNickname(inputUserNickname === "" ? annonNickname : inputUserNickname);
    setUserColor(profileColor);
    if (socket) {
      socket.emit(
        "create-room",

        (roomCode: string) => {
          setIsHost(true);
          setRoomCode(roomCode);
          navigate(`${roomCode}/lobby`);
        }
      );
    }
  };

  useEffect(() => {
    axios
      .get("/user")
      .then((res) => {
        if (res.data.success) {
          setLoginSuccess(true);
          setLoginedUserNickname(res.data.nickname);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const participateRoom = () => {
    // TODO: 회원 유저에 대한 조건부 처리 필요
    setNickname(inputUserNickname === "" ? annonNickname : inputUserNickname);
    setUserColor(profileColor);
    if (paramRoomCode) {
      // 파라미터를 통해서 방에 입장하려고 할 때
      setRoomCode(paramRoomCode);
      navigate(`${paramRoomCode}/lobby`);
    } else {
      setRoomCode(inputRoomCode);
      navigate(`${inputRoomCode}/lobby`);
    }
  };

  const userLogout = () => {
    axios
      .get("/logout")
      .then((_) => {
        setLoginSuccess(false);
        setLoginedUserNickname("");
        setInputEmail("");
        setInputPassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <S.LoginForm>
        {paramRoomCode ? <S.TabInfo>방에 초대되었습니다!</S.TabInfo> : ""}
        <S.TabLayout>
          <S.GuestTabButton
            tabToggle={tabToggle}
            onClick={() => {
              setTabToggle("guest");
            }}
          >
            게스트
          </S.GuestTabButton>
          <S.MemberTabButton
            tabToggle={tabToggle}
            onClick={() => {
              setTabToggle("member");
            }}
          >
            회원
          </S.MemberTabButton>
        </S.TabLayout>
        <S.ProfileWrapper>
          {tabToggle === "guest" ? (
            <S.ProfileImgLayout>
              <S.ProfileImgSection>
                <Profile iconWidth="150px" iconHeight="150px" profileColor={profileColor} />
              </S.ProfileImgSection>
              <S.NicknameSection>
                <S.TextFieldWrapper>
                  <S.NicknameInfo>사용할 닉네임 입력</S.NicknameInfo>

                  <TextField
                    style={{ width: "250px" }}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setInputUserNickname(e.currentTarget.value);
                    }}
                    placeholder={annonNickname}
                  />
                </S.TextFieldWrapper>
              </S.NicknameSection>
            </S.ProfileImgLayout>
          ) : (
            <S.ProfileImgLayout
              style={{
                width: "86%",
              }}
            >
              <S.ProfileImgSection>
                <Profile iconWidth="150px" iconHeight="150px" profileColor={profileColor} />
              </S.ProfileImgSection>
              {loginSuccess ? (
                <S.NicknameSection>
                  <S.TextFieldWrapper>
                    <S.NicknameInfo> 환영합니다. {loginedUserNickname}님</S.NicknameInfo>
                    <p style={{ marginTop: "4px", marginBottom: "6px" }}>
                      방을 만들거나 초대 코드를 통해 방에 참가하세요.
                    </p>
                    <S.NicknameSection>
                      <Button
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        프로필 보기
                      </Button>
                      <Button buttonType="warning" onClick={userLogout}>
                        로그아웃
                      </Button>
                    </S.NicknameSection>
                  </S.TextFieldWrapper>
                </S.NicknameSection>
              ) : (
                <S.TextFieldWrapper>
                  <S.NicknameSection>
                    <S.TextFieldWrapper>
                      <TextField
                        style={{ width: "250px" }}
                        onChange={inputEmailHandler}
                        placeholder="이메일"
                        value={inputEmail}
                      />
                      <TextField
                        style={{ width: "250px" }}
                        onChange={inputPasswordHandler}
                        placeholder="비밀번호"
                        type="password"
                        value={inputPassword}
                      />
                    </S.TextFieldWrapper>
                    <S.TextFieldWrapper>
                      <Button style={{ width: "105px", height: "75px", marginTop: "0px" }} onClick={onSubmit}>
                        로그인
                      </Button>
                      <S.Nav>
                        <S.NavItem
                          onClick={() => {
                            setModal(!modal);
                          }}
                        >
                          회원가입
                        </S.NavItem>
                        <S.Hr />
                        <S.NavItem>비번찾기</S.NavItem>
                      </S.Nav>
                    </S.TextFieldWrapper>
                  </S.NicknameSection>

                  {loginFailed ? (
                    <p style={{ marginTop: "3px", color: "#ff3d3d" }}>아이디 또는 비밀번호가 일치하지 않습니다.</p>
                  ) : null}
                </S.TextFieldWrapper>
              )}
            </S.ProfileImgLayout>
          )}
        </S.ProfileWrapper>

        <S.SubmitLayout>
          {paramRoomCode ? (
            <Button
              style={{ width: "180px" }}
              disabled={tabToggle === "member" && loginSuccess === false}
              onClick={participateRoom}
            >
              참가
            </Button>
          ) : (
            <>
              <Button disabled={tabToggle === "member" && !loginSuccess} onClick={createRoom}>
                방 만들기
              </Button>

              <TextField
                style={{ width: "auto" }}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setInputRoomCode(e.currentTarget.value);
                }}
                placeholder="코드 또는 링크 입력"
              />
              <Button
                disabled={inputRoomCode === "" || (tabToggle === "member" && loginSuccess === false)}
                onClick={participateRoom}
              >
                참가
              </Button>
            </>
          )}
        </S.SubmitLayout>
      </S.LoginForm>

      <S.GameDescriptionLayout>
        <h1>게임 설명</h1>
      </S.GameDescriptionLayout>
    </>
  );
};
export default MainElement;
