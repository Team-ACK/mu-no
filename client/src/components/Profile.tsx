import styled from "styled-components";
import { ReactComponent as ProfileImg } from "../assets/img/profile_img.svg";

type Props = {
  iconWidth: string | undefined;
  iconHeight: string | undefined;
  profileColor: string | undefined;
};

const S = {
  Profile: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 158px;
    height: 158px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: ${({ profileColor }: { profileColor: string | undefined }) => profileColor};
  `,
};

const Profile: React.FC<Props> = ({ iconWidth, iconHeight, profileColor }: Props) => (
  <S.Profile profileColor={profileColor}>
    <ProfileImg width={iconWidth} height={iconHeight} fill="white" />
  </S.Profile>
);

export default Profile;
