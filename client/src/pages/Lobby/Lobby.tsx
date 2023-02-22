import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container } from "../../components";
import { userStore, socketStore, lobbyStore } from "../../store";
import { HeaderElement, MainElement, Description } from "./components";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 1px solid red;
`;

const S = {
  HeaderLayout: styled(LayoutStyle)`
    flex-basis: 17.8%;
  `,

  MainLayout: styled(LayoutStyle)`
    border: none;
    margin-top: 15px;
    flex-basis: 82.2%;
  `,
};

const Lobby = () => {
  const location = useLocation();

  const { socket } = socketStore();
  const { nickname, userColor, roomCode } = userStore();
  const { setUserList, setHeadCount } = lobbyStore();

  const [renderStatus, setRenderStatus] = useState<"valid" | "loading" | "isGaming" | "isFull" | "notExist">("loading");

  useEffect(() => {
    const enterUrl = "http://localhost:8080".concat(location.pathname.split("/lobby")[0]);
    // const enterUrl = "http://muno.fun".concat(location.pathname.split("/lobby")[0]);
    if (!nickname) {
      window.location.replace(enterUrl);
    }

    socket?.emit(
      "join-room",
      { nickname, userColor, roomID: roomCode },
      (res: { isValid: boolean; reason?: "isGaming" | "isFull" }) => {
        if (res.isValid) {
          setRenderStatus("valid");
        } else if (res.reason !== undefined) {
          setRenderStatus(res.reason);
        }
      }
    );

    socket?.on("user-list", (data: any) => {
      setUserList(data);
      setHeadCount(data.length);
    });

    return () => {
      socket?.off("user-list");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <>
        <S.HeaderLayout>
          <HeaderElement />
        </S.HeaderLayout>
        <S.MainLayout>
          {renderStatus === "valid" ? (
            <MainElement />
          ) : (
            <Description>
              {renderStatus === "loading" ? (
                <p>방에 입장중입니다..</p>
              ) : renderStatus === "isGaming" ? (
                <p>현재 게임이 진행 중인 방입니다</p>
              ) : renderStatus === "isFull" ? (
                <p>방이 가득 찼습니다</p>
              ) : renderStatus === "notExist" ? (
                <p>방이 존재하지 않습니다</p>
              ) : (
                <p> </p>
              )}
            </Description>
          )}
        </S.MainLayout>
      </>
    </Container>
  );
};

export default Lobby;
