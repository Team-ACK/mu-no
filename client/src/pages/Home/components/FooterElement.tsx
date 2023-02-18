import styled from "styled-components";
import TeamLogoSrc from "../../../assets/img/ack.jpg";
import GameLogoSrc from "../../../assets/img/muno.png";

const LayoutStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LogoStyle = styled.a`
  cursor: pointer;
  background-position: center !important;
  background-size: cover !important;
  height: 45px;
`;

const S = {
  GameLogoLayout: styled(LayoutStyle)`
    justify-content: left;
    flex-basis: 15%;
  `,
  InfoLayout: styled(LayoutStyle)`
    align-self: center;
    flex-basis: 70%;
  `,
  TeamLogoLayout: styled(LayoutStyle)`
    justify-content: right;
    flex-basis: 15%;
  `,
  TeamLogo: styled(LogoStyle)`
    background: url(${TeamLogoSrc});
    width: 109px;
  `,
  GameLogo: styled(LogoStyle)`
    background: url(${GameLogoSrc});
    width: 186px;
  `,
  Nav: styled.nav`
    display: flex;
    align-items: center;
    margin: 4px 0px 0px;
  `,
  NavItem: styled.a`
    text-decoration: none;
    cursor: pointer;
  `,
  Hr: styled.hr`
    border: none;
    width: 1px;
    height: 18px;
    margin: 0 10px;
    background-color: ${(props) => props.theme.palette.black};
  `,
};

const FooterElement = () => {
  return (
    <>
      <S.GameLogoLayout>
        <S.GameLogo href="/" />
      </S.GameLogoLayout>

      <S.InfoLayout>
        <S.Nav>
          <S.NavItem target="_blank" href="https://github.com/Team-ACK">
            Github
          </S.NavItem>
          <S.Hr />
          <S.NavItem>Blog</S.NavItem>
          <S.Hr />
          <S.NavItem>Contact Us</S.NavItem>
          <S.Hr />
          <S.NavItem>Donation</S.NavItem>
        </S.Nav>
      </S.InfoLayout>

      <S.TeamLogoLayout>
        <S.TeamLogo href="https://github.com/Team-ACK" />
      </S.TeamLogoLayout>
    </>
  );
};

export default FooterElement;
