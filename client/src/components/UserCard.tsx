import styled from "styled-components";
import { ReactComponent as ProfileImg } from "../assets/img/profile_img.svg";

type Props = {
  children: JSX.Element;
  profileColor: string;
  nickname: string;
  isMe?: boolean;
};

const LayoutStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const S = {
  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-basis: 100px;
    position: relative;
    flex-shrink: 0;
  `,
  PlayerLayout: styled(LayoutStyle)`
    width: 93%;
    height: 90%;
    border: 1px solid darkgray;
    border-radius: 100px 25px 25px 100px;
    margin: 10px 10px 5px 10px;
    flex-direction: row;
  `,
  UserImgLayout: styled(LayoutStyle)`
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    flex-direction: row;
    margin: 0px 10px;
    background-color: ${({ profileColor }: { profileColor: string | undefined }) => profileColor};
  `,
  UserNameLayout: styled(LayoutStyle)`
    align-items: flex-start;
    flex: 1 1 0%;
    color: ${({ isMe }: { isMe?: boolean }) => (isMe ? "green" : "black")};
  `,
  UserAuthLayout: styled(LayoutStyle)`
    width: 50px;
    height: 50px;
    margin-right: 15px;
  `,
};

const UserCard: React.FC<Props> = ({ children, profileColor, nickname, isMe }: Props) => (
  <S.Wrapper>
    <S.PlayerLayout>
      <S.UserImgLayout profileColor={profileColor}>
        <ProfileImg width="50px" height="50px" fill="white" />
      </S.UserImgLayout>

      <S.UserNameLayout isMe={isMe}>{nickname}</S.UserNameLayout>

      <S.UserAuthLayout>{children}</S.UserAuthLayout>
    </S.PlayerLayout>
  </S.Wrapper>
);

export default UserCard;
