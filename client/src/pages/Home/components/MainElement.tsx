import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Profile, Button } from "../../../components";
import { userStore, socketStore, modalHandleStore } from "../../../store";
import { HOST_URL, END_POINT } from "../../../utils/envProvider";

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

const TabButtonStyle = styled(FlexAlignStyle)`
  width: 100%;
  height: 100%;
  cursor: pointer;
  ${(props) => props.theme.typography.information};
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
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
  GuestTabButton: styled(TabButtonStyle)<{ tabToggle: "guest" | "member"; enableRadius: boolean }>`
    background-color: ${({ tabToggle }) => (tabToggle === "member" ? "#fafafa" : "")};
    box-shadow: ${({ tabToggle }) => (tabToggle === "member" ? "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset" : "")};
    border-radius: ${({ enableRadius }) => (enableRadius ? "12px 0 0 0" : "0")};
    height: 54px;
  `,
  MemberTabButton: styled(TabButtonStyle)<{ tabToggle: "guest" | "member"; enableRadius: boolean }>`
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    background-color: ${({ tabToggle }: { tabToggle: "guest" | "member" }) => (tabToggle === "guest" ? "#fafafa" : "")};
    box-shadow: ${({ tabToggle }: { tabToggle: "guest" | "member" }) =>
      tabToggle === "guest" ? "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset" : ""};
    border-radius: ${({ enableRadius }) => (enableRadius ? "0 12px 0 0" : "0")};
    height: 54px;
  `,

  TabInfo: styled(FlexAlignStyle)`
    font-size: 21px;
    width: 100%;
    height: 34px;
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
  TopWrapper: styled(FlexAlignStyle)`
    justify-content: start;
  `,
};

const MainElement = ({ paramRoomCode }: { paramRoomCode: string | undefined }) => {
  const navigate = useNavigate();
  const { setRoomCode, setNickname, setUserColor, setIsHost, setIsMember } = userStore();
  const { socket } = socketStore();
  const { setModal } = modalHandleStore();

  const generateRandNickname = (min: number, max: number): string => {
    return `??????${(Math.random() * (max - min) + min).toFixed()}`;
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
      axios.post(`${END_POINT}/signin`, { email: inputEmail, password: inputPassword }).then((res) => {
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
    if (tabToggle === "member") {
      setNickname(loginedUserNickname);
      setIsMember(true);
    } else if (tabToggle === "guest") {
      setNickname(inputUserNickname === "" ? annonNickname : inputUserNickname);
    }
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
      .get(`${END_POINT}/user`)
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
    if (tabToggle === "member") {
      setNickname(loginedUserNickname);
      setIsMember(true);
    } else if (tabToggle === "guest") {
      setNickname(inputUserNickname === "" ? annonNickname : inputUserNickname);
    }
    setUserColor(profileColor);
    if (paramRoomCode) {
      // ??????????????? ????????? ?????? ??????????????? ??? ???
      setRoomCode(paramRoomCode);
      navigate(`${paramRoomCode}/lobby`);
    } else {
      setRoomCode(inputRoomCode.replace(`${HOST_URL}/`, "").replace("/lobby", ""));
      navigate(`${inputRoomCode.replace(`${HOST_URL}/`, "").replace("/lobby", "")}/lobby`);
    }
  };

  const userLogout = () => {
    axios
      .get(`${END_POINT}/logout`)
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
        <S.TopWrapper>
          {paramRoomCode ? (
            <S.TabInfo>
              <p>?????? ?????????????????????!</p>
            </S.TabInfo>
          ) : (
            ""
          )}
          <S.TabLayout>
            <S.GuestTabButton
              tabToggle={tabToggle}
              enableRadius={paramRoomCode === undefined}
              onClick={() => {
                setTabToggle("guest");
              }}
            >
              ?????????
            </S.GuestTabButton>
            <S.MemberTabButton
              tabToggle={tabToggle}
              enableRadius={paramRoomCode === undefined}
              onClick={() => {
                setTabToggle("member");
              }}
            >
              ??????
            </S.MemberTabButton>
          </S.TabLayout>
        </S.TopWrapper>
        <S.ProfileWrapper>
          {tabToggle === "guest" ? (
            <S.ProfileImgLayout>
              <S.ProfileImgSection>
                <Profile iconWidth="150px" iconHeight="150px" profileColor={profileColor} />
              </S.ProfileImgSection>
              <S.NicknameSection>
                <S.TextFieldWrapper>
                  <S.NicknameInfo>????????? ????????? ??????</S.NicknameInfo>

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
                    <S.NicknameInfo> ???????????????. {loginedUserNickname}???</S.NicknameInfo>
                    <p style={{ marginTop: "4px", marginBottom: "6px" }}>
                      ?????? ???????????? ?????? ????????? ?????? ?????? ???????????????.
                    </p>
                    <S.NicknameSection>
                      <Button
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        ????????? ??????
                      </Button>
                      <Button buttonType="warning" onClick={userLogout}>
                        ????????????
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
                        placeholder="?????????"
                        value={inputEmail}
                      />
                      <TextField
                        style={{ width: "250px" }}
                        onChange={inputPasswordHandler}
                        placeholder="????????????"
                        type="password"
                        value={inputPassword}
                      />
                    </S.TextFieldWrapper>
                    <S.TextFieldWrapper>
                      <Button style={{ width: "105px", height: "75px", marginTop: "0px" }} onClick={onSubmit}>
                        ?????????
                      </Button>
                      <S.Nav>
                        <S.NavItem
                          onClick={() => {
                            setModal("SignUp");
                          }}
                        >
                          ????????????
                        </S.NavItem>
                        <S.Hr />
                        <S.NavItem
                          onClick={() => {
                            setModal("FindPassword");
                          }}
                        >
                          ????????????
                        </S.NavItem>
                      </S.Nav>
                    </S.TextFieldWrapper>
                  </S.NicknameSection>

                  {loginFailed ? (
                    <p style={{ marginTop: "3px", color: "#ff3d3d" }}>????????? ?????? ??????????????? ???????????? ????????????.</p>
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
              ??????
            </Button>
          ) : (
            <>
              <Button disabled={tabToggle === "member" && !loginSuccess} onClick={createRoom}>
                ??? ?????????
              </Button>

              <TextField
                style={{ width: "auto" }}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setInputRoomCode(e.currentTarget.value);
                }}
                placeholder="?????? ?????? ?????? ??????"
              />
              <Button
                disabled={inputRoomCode === "" || (tabToggle === "member" && loginSuccess === false)}
                onClick={participateRoom}
              >
                ??????
              </Button>
            </>
          )}
        </S.SubmitLayout>
      </S.LoginForm>

      <S.GameDescriptionLayout>
        <h1>?????? ??????</h1>
      </S.GameDescriptionLayout>
    </>
  );
};
export default MainElement;
