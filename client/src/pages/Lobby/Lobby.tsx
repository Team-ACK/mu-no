import { useState, useEffect } from "react";
import styled from "styled-components";
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
  const { socket } = socketStore();
  const { nickname, userColor, roomCode } = userStore();

  const { setUserList, setHeadCount } = lobbyStore();

  const [renderStatus, setRenderStatus] = useState("loading");

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", { nickname, userColor, roomID: roomCode }, (isValid: boolean) => {
        isValid ? setRenderStatus("valid") : setRenderStatus("invalid");
      });

      socket.on("user-list", (data: any) => {
        setUserList(data);
        setHeadCount(data.length);
      });
    }
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
              <p>{renderStatus === "loading" ? "방에 입장중입니다.." : "방이 존재하지 않습니다."}</p>
            </Description>
          )}
        </S.MainLayout>
      </>
    </Container>
  );
};

export default Lobby;
