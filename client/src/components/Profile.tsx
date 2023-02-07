import styled from "styled-components";
import { ReactComponent as ProfileImg } from "../assets/img/profile_img.svg";

type Props = {
  width: string;
  profileColor: string;
  height: string;
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

const Profile: React.FC<Props> = ({ width, height, profileColor }: Props) => (
  <S.Profile profileColor={profileColor}>
    <ProfileImg width={width} height={height} fill="white" />
  </S.Profile>
);

export default Profile;
