import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as ProfileImg } from "../../../assets/img/profile_img.svg";
import { TextField, Button } from "../../../components";
import { userStore } from "../../../store";

const LayoutStyle = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.palette.black};
  height: 87.8%;
  border-radius: 12px;
`;

const LoginFormStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  /* border: 1px solid red; */
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
    flex-basis: 65%;
  `,
  Profile: styled(FlexAlignStyle)`
    width: 158px;
    height: 158px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    flex-direction: row;
  `,
  NicknameInfo: styled.h2`
    margin-bottom: 5px;
    ${(props) => props.theme.typography.information};
  `,

  TabButton: styled(FlexAlignStyle)`
    cursor: pointer;
    ${(props) => props.theme.typography.information};
    width: 100%;
    height: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  `,
  TabInfo: styled(FlexAlignStyle)`
    ${(props) => props.theme.typography.information};
    width: 100%;
    height: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  `,
};

const MainElement = ({ paramRoomCode }: { paramRoomCode: String | undefined }) => {
  const navigate = useNavigate();

  const { setNickname, setUserColor } = userStore();

  const generateRandNickname = (min: number, max: number): string => {
    return `익명${(Math.random() * (max - min) + min).toFixed()}`;
  };

  const generateRandColor = (): string => {
    const colorR = Math.floor(Math.random() * 127 + 128).toString(16);
    const colorG = Math.floor(Math.random() * 127 + 128).toString(16);
    const colorB = Math.floor(Math.random() * 127 + 128).toString(16);
    return `#${colorR + colorG + colorB}`;
  };

  const [annonNickname] = useState(generateRandNickname(1000, 9999));

  const [profileColor] = useState(generateRandColor());

  const [inputRoomCode, setInputRoomCode] = useState("");
  const [inputUserNickname, setInputUserNickname] = useState("");

  const generateRoom = () => {
    console.log(`방 생성 이벤트`);
  };

  const participateRoom = () => {
    setNickname(inputUserNickname === "" ? annonNickname : inputUserNickname);
    setUserColor(profileColor);
    if (paramRoomCode) {
      // 파라미터를 통해서 방에 입장하려고 할 때
      navigate(`${paramRoomCode}/lobby`);
    }

    if (inputRoomCode === "") {
      // 코드를 직접 입력해서 방에 입장하려고 할 때
      return;
    }
    navigate(`${inputRoomCode}/lobby`);
  };

  return (
    <>
      <S.LoginForm>
        <S.TabLayout>
          {paramRoomCode ? (
            <S.TabInfo>방에 초대되었습니다!</S.TabInfo>
          ) : (
            <>
              <S.TabButton>게스트</S.TabButton>
              <S.TabButton style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.2)" }}>회원</S.TabButton>
            </>
          )}
        </S.TabLayout>

        <S.ProfileWrapper>
          <S.ProfileImgLayout>
            <S.ProfileImgSection>
              <S.Profile style={{ backgroundColor: `${profileColor}` }}>
                <ProfileImg width="150px" height="150px" fill="white" />
              </S.Profile>
            </S.ProfileImgSection>
            <S.NicknameSection>
              <S.NicknameInfo>사용할 닉네임 입력</S.NicknameInfo>
              <TextField
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setInputUserNickname(e.currentTarget.value);
                }}
                placeholder={annonNickname}
                size="250px"
              />
            </S.NicknameSection>
          </S.ProfileImgLayout>
        </S.ProfileWrapper>

        <S.SubmitLayout>
          {paramRoomCode ? (
            <Button onClick={participateRoom} size="180px">
              참가
            </Button>
          ) : (
            <>
              <Button onClick={generateRoom}>방 만들기</Button>
              <TextField
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setInputRoomCode(e.currentTarget.value);
                }}
                placeholder="코드 또는 링크 입력"
              />
              {inputRoomCode === "" ? (
                <Button disabled style={{ cursor: "default", backgroundColor: "#b8baff" }} onClick={participateRoom}>
                  참가
                </Button>
              ) : (
                <Button onClick={participateRoom}>참가</Button>
              )}
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
