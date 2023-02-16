import { useState, useEffect } from "react";
import styled from "styled-components";

const S = {
  Wrapper: styled.div`
    position: absolute;
    left: calc(100vw / 2 - 600px);
    top: calc(100vh / 2 - 400px);
  `,

  InnerContainer: styled.div`
    width: 1200px;
    height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 15px;
    border: 1px solid ${(props) => props.theme.palette.borderColor};
    box-shadow: 0px 0px 10px 2px ${(props) => props.theme.palette.shadowColor};
    border-radius: 12px;
  `,
};

const Container = ({ children }: { children: JSX.Element }) => {
  const [scale, setScale] = useState(Math.min(window.innerWidth / 1400, window.innerHeight / 900));

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
    <S.Wrapper style={{ transform: `scale(${scale})` }}>
      <S.InnerContainer>{children}</S.InnerContainer>
    </S.Wrapper>
  );
};

export default Container;
