import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as CloseImg } from "../assets/img/close.svg";
import { modalHandleStore } from "../store";
import { SignUp } from "./SignUp";
import { FindPassword } from "./FindPassword";
import { ResetPassword } from "./ResetPassword";
import { HostDisconnected } from "./HostDisconnected";

const boxFade = (nowScale: number) => keyframes`
  0% {
     opacity: 0;
    transform: translateY(400px) scale(${0.75 * nowScale});
  }
  75% {
    opacity: 1; 
    transform: translateY(-16px) scale(${nowScale});
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(${nowScale});
  }
`;

const CommonStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const S = {
  Background: styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(231, 231, 231, 0.5);
    z-index: 5;
    padding: 30px;
  `,
  Wrapper: styled.div<{ nowScale: number }>`
    animation: 0.4s ease-in-out 0s 1 normal forwards running ${({ nowScale }) => boxFade(nowScale)};
    background: white;
    position: absolute;
    left: calc(100vw / 2 - 250px);
    top: calc(100vh / 2 - 350px);
    border-radius: 12px;
  `,
  InnerContainer: styled(CommonStyle)`
    width: 500px;
    height: 700px;
    padding: 15px 20px;
    border: 1px solid ${(props) => props.theme.palette.borderColor};
    box-shadow: 0px 0px 10px 2px ${(props) => props.theme.palette.shadowColor};
  `,
  CloseLayout: styled(CommonStyle)`
    width: 100%;
    align-items: flex-end;
  `,
};

const ModalContainer = () => {
  const [scale, setScale] = useState<number>(Math.min(window.innerWidth / 1400, window.innerHeight / 900));

  const handleResize = () => {
    setScale(Math.min(window.innerWidth / 1400, window.innerHeight / 900));
  };

  const { modal, removeModal } = modalHandleStore();

  useEffect(() => {
    const escKeyModalClose = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        if (modal === "ResetPassword" || modal === "HostDisconnected") {
          window.location.replace("/");
        } else {
          removeModal();
        }
      }
    };
    window.addEventListener("keydown", escKeyModalClose);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", escKeyModalClose);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, []);

  // TODO: size 변경시 애니메이션 재실행 되는 상황 해결

  return (
    <S.Background>
      <S.Wrapper style={{ transform: `scale(${scale})` }} nowScale={scale}>
        <S.InnerContainer>
          <S.CloseLayout>
            <CloseImg
              width="25px"
              height="25px"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (modal === "ResetPassword" || modal === "HostDisconnected") {
                  window.location.replace("/");
                } else {
                  removeModal();
                }
              }}
            />
          </S.CloseLayout>
          {modal === "SignUp" ? (
            <SignUp />
          ) : modal === "FindPassword" ? (
            <FindPassword />
          ) : modal === "ResetPassword" ? (
            <ResetPassword />
          ) : modal === "HostDisconnected" ? (
            <HostDisconnected />
          ) : null}
        </S.InnerContainer>
      </S.Wrapper>
    </S.Background>
  );
};

export default ModalContainer;
