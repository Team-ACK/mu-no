import styled from "styled-components";
import { ReactComponent as ProfileImg } from "../assets/img/profile_img.svg";

type Props = {
  iconwidth: string | undefined;
  iconheight: string | undefined;
  profileColor: string | undefined;
};

const S = {
  Profile: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 158px;
    height: 158px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    flex-direction: row;
    background-color: ${({ profileColor }: { profileColor: string | undefined }) => profileColor};
  `,
};

const Profile: React.FC<Props> = ({ iconwidth, iconheight, profileColor }: Props) => (
  <S.Profile profileColor={profileColor}>
    <ProfileImg width={iconwidth} height={iconheight} fill="white" />
  </S.Profile>
);

export default Profile;
