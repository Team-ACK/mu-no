import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
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
  GameHeader: styled.div`
    flex-basis: 15%;
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

  useEffect(() => {
    console.log(stat);
  }, [stat]);

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
            <p>{participant[i].isDied ? "사망" : "생존 ✅"}</p>
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

  useEffect(() => {
    addUserLayout();
  }, [participant]);

  /*
    1. 서버로 start 신호를 보내서 신호를 다 받으면 게임을 실행한다. 
    이러 ㅁ되느 ㄴ거 아님?

    안정성이 좀 떨어지겠지 뭐

    
  */

  useEffect(() => {
    // 소켓 on - stat이 die 가 아닐때 시간을 받는다면 stat을 wait으로 변경하고 n초뒤에 stat을 click로 바꿈
    socket?.off("reaction-game-round-start");
    socket?.on("reaction-game-round-start", (time: number) => {
      console.log(stat);
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
    socket?.off("reaction-game-round-result");
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
  }, [stat]);

  const sendReady = () => {
    socket?.emit("reaction-game-ready", { roomID: roomCode });
    setStat("readyFinish");
  };

  const sendSpeed = () => {
    // 소켓 emit
    endTime.current = new Date();
    setStat("");
    if (endTime.current !== undefined && startTime.current !== undefined) {
      let temptime: number = endTime.current.getTime() - startTime.current.getTime();
      setSpeed(temptime);
      socket?.emit("reaction-game-user-result", {
        roomID: roomCode,
        speed: temptime,
      });
      clearTimeout(timeout.current as NodeJS.Timeout);
    }
  };

  return (
    <Container>
      <S.GameWrapper>
        <S.GameHeader>
          <p>난 헤더임</p>
        </S.GameHeader>
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
      </S.GameWrapper>
    </Container>
  );
};

export default Reaction;
