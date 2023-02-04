import styled from "styled-components";
import GameLogoSrc from "../../../assets/img/muno.png";

const S = {
  GameLogo: styled.a`
    cursor: pointer;
    background-position: center !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    width: 40%;
    height: 40%;
    background: url(${GameLogoSrc});
  `,
};

const HeaderElement = () => {
  return <S.GameLogo />;
};

export default HeaderElement;
