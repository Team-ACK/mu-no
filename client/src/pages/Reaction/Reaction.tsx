import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { socketStore, userStore, lobbyStore } from "../../store";
import { Container, UserCard } from "../../components";
import { ReactionButton } from "./components";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const S = {
  GameWrapper: styled(LayoutStyle)`
    flex-direction: column;
  `,
  WhiteSpace: styled(LayoutStyle)`
    align-items: end;
    flex-basis: 45%;
  `,
  GameMain: styled(LayoutStyle)``,
  GameLayout: styled(LayoutStyle)`
    flex-basis: 43.6%;
  `,
  PlayerLayout: styled(LayoutStyle)`
    flex-direction: column;
    flex-basis: 28.2%;
  `,
};

type participantType = {
  admin: boolean;
  nickname: string;
  userColor: string;
  socketID: string;
  isDied: boolean;
};

const Reaction = () => {
  const { userList } = lobbyStore();

  const addDiedProps = () => {
    const copy = JSON.parse(JSON.stringify(userList));
    for (const element of copy) {
      element.isDied = false;
    }
    return copy;
  };

  const [participant, setParticipant] = useState<participantType[]>(addDiedProps);
  const [stat, setStat] = useState<string>("ready");
  const [speed, setSpeed] = useState<number>(0);
  const [element, setElement] = useState<JSX.Element[]>([]);

  const { socket } = socketStore();
  const { roomCode } = userStore();

  const renderDelay = useRef<NodeJS.Timeout | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<Date>();
  const endTime = useRef<Date>();

  const addUserLayout = () => {
    const temp: JSX.Element[] = [];
    for (let i = 0; i < 8; i += 1) {
      temp.push(
        participant[i] ? (
          <UserCard
            profileColor={`${participant[i].userColor}`}
            nickname={`${participant[i].nickname}`}
            isMe={socket?.id === userList[i].socketID}
          >
            <p>{participant[i].isDied ? "사망 ❌" : "생존 ✅"}</p>
          </UserCard>
        ) : (
          <UserCard profileColor="black" nickname="비어있음">
            <p> </p>
          </UserCard>
        )
      );
    }
    setElement(temp);
  };

  const sendReady = () => {
    socket?.emit("reaction-game-ready", { roomID: roomCode });
    setStat("readyFinish");
  };

  const sendSpeed = () => {
    // 소켓 emit
    endTime.current = new Date();
    setStat("");
    if (endTime.current !== undefined && startTime.current !== undefined) {
      const reactionSpeed: number = endTime.current.getTime() - startTime.current.getTime();
      setSpeed(reactionSpeed);
      socket?.emit("reaction-game-user-result", {
        roomID: roomCode,
        speed: reactionSpeed,
      });
      clearTimeout(timeout.current as NodeJS.Timeout);
    }
  };

  useEffect(() => {
    addUserLayout();
    // eslint-disable-next-line
  }, [participant]);

  useEffect(() => {
    // 소켓 on - stat이 die 가 아닐때 시간을 받는다면 stat을 wait으로 변경하고 n초뒤에 stat을 click로 바꿈

    socket?.on("reaction-game-round-start", (time: number) => {
      if (stat !== "die") {
        renderDelay.current = setTimeout(() => {
          setStat("wait");
        }, 1500);
        timeout.current = setTimeout(() => {
          setStat("click");
          startTime.current = new Date();
        }, time);
      }
    });
    // 소켓 on - stat이 die 가 아닐때 사용자들의 결과를 받는다면 sort후 탈락자 선별, 탈락자의 UserCard에 탈락을 표시하고 만약
    // 자신이 탈락했다면, stat을 die로 변경함
    socket?.on("reaction-game-round-result", (result: { socketID: string; time: number }[]) => {
      const maxResult = result.reduce((prev, next) => {
        return prev.time >= next.time ? prev : next;
      });
      if (socket.id === maxResult.socketID) {
        setStat("die");
      }
      const copy = JSON.parse(JSON.stringify(participant));
      for (const temp of copy) {
        if (temp.socketID === maxResult.socketID) {
          temp.isDied = true;
        }
      }
      setParticipant(copy);
    });

    return () => {
      socket?.off("reaction-game-round-start");
      socket?.off("reaction-game-round-result");
    };
    // eslint-disable-next-line
  }, [stat]);

  return (
    <Container>
      <S.GameWrapper>
        <S.WhiteSpace>
          <p>라운드 표시</p>
        </S.WhiteSpace>
        <S.GameMain>
          <S.PlayerLayout>{element.slice(0, 4)}</S.PlayerLayout>
          <S.GameLayout>
            {stat === "ready" ? (
              <ReactionButton stat={stat} onClick={sendReady} />
            ) : stat === "click" ? (
              <ReactionButton stat={stat} onClick={sendSpeed} />
            ) : (
              <ReactionButton disabled stat={stat} speed={speed} />
            )}
          </S.GameLayout>
          <S.PlayerLayout>{element.slice(-4)}</S.PlayerLayout>
        </S.GameMain>
        <S.WhiteSpace />
      </S.GameWrapper>
    </Container>
  );
};

export default Reaction;
