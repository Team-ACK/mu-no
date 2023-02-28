import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socketStore, userStore, lobbyStore, modalHandleStore } from "../../store";
import { Container } from "../../components";
import { ReactionButton, ParticipantList } from "./components";
import usePreventWrongApproach from "../../hooks/usePreventWrongApproach";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

type ParticipantType = {
  admin: boolean;
  nickname: string;
  userColor: string;
  socketID: string;
  isDied: boolean;
  recentSpeed: number;
};

const S = {
  GameWrapper: styled(LayoutStyle)`
    flex-direction: column;
  `,
  GameMain: styled(LayoutStyle)``,
  WhiteSpaceTop: styled(LayoutStyle)`
    align-items: end;
    flex-basis: 45%;
  `,
  WhiteSpaceBottom: styled(LayoutStyle)`
    flex-basis: 30%;
  `,
  GameLayout: styled(LayoutStyle)`
    flex-basis: 43.6%;
  `,
  PlayerLayout: styled(LayoutStyle)`
    flex-direction: column;
    flex-basis: 28.2%;
  `,
  RoundContainer: styled(LayoutStyle)`
    width: 30%;
    height: 60%;
    border: 1px solid lightgray;
    border-radius: 11px;
  `,
  Round: styled.p`
    font-weight: 500;
    font-size: 34px;
  `,
};

const Reaction = () => {
  const location = useLocation();
  usePreventWrongApproach(location.pathname);

  // global status
  const { socket } = socketStore();
  const { nickname, roomCode } = userStore();
  const { userList, setUserList, setHeadCount } = lobbyStore();
  const { setModal } = modalHandleStore();

  // local status
  const [round, setRound] = useState<number>(0); // 0: round 시작 전
  const [stat, setStat] = useState<"ready" | "readyFinish" | "wait" | "click" | "clickFinish" | "die">("ready");
  const [speed, setSpeed] = useState<number | null>(null);
  const [participant, setParticipant] = useState<ParticipantType[]>(() =>
    userList.map((user) => {
      return { ...user, isDied: false, recentSpeed: 0 };
    })
  );

  // useRef
  const renderDelay = useRef<NodeJS.Timeout | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<Date>();
  const endTime = useRef<Date>();

  // hooks
  useEffect(() => {
    if (!nickname) {
      // const url = "http://localhost:8080";
      const url = "http://muno.fun";
      window.location.replace(url);
    }
  }, []);

  useEffect(() => {
    socket?.on("user-list", (data: { userList: any }) => {
      setUserList(data.userList);
      setHeadCount(data.userList.length);
    });
    socket?.on("reaction-game-round-start", ({ randomTime }: { randomTime: number }) => {
      renderDelay.current = setTimeout(() => {
        if (stat !== "die") {
          setStat("wait");
        }
        setParticipant(
          participant.map((user) => {
            return { ...user, recentSpeed: 0 };
          })
        );
        setRound(round + 1);
        // recentSpeed 0으로 초기화
      }, 1500);

      if (stat !== "die") {
        timeout.current = setTimeout(() => {
          setStat("click");
          startTime.current = new Date();
        }, randomTime);
      }
    });

    socket?.on(
      "reaction-game-round-result",
      ({ getGameResult }: { getGameResult: { socketID: string; speed: number }[] }) => {
        // 임시 탈락자 선정 과정
        const dropOut = getGameResult.reduce((prev, next) => {
          return prev.speed >= next.speed ? prev : next;
        });

        if (socket.id === dropOut.socketID) {
          setStat("die");
        }

        setParticipant(
          participant.map((user) => {
            if (!user.isDied) {
              return {
                ...user,
                recentSpeed: getGameResult.filter((data) => data.socketID === user.socketID)[0].speed,
                isDied: user.socketID === dropOut.socketID,
              };
            }
            return user;
          })
        );
      }
    );

    socket?.on("admin-exit", () => {
      setModal("HostDisconnected");
    });

    return () => {
      socket?.off("user-list");
      socket?.off("reaction-game-round-start");
      socket?.off("reaction-game-round-result");
      socket?.off("admin-exit");
    };
  });

  // Handle Participant - 참가자가 게임을 나가는 경우에 대한 처리
  useEffect(() => {
    setParticipant(participant.filter((user) => userList.some((item) => item.socketID === user.socketID)));
  }, [userList]);

  // 버튼 클릭 시 조건에 맞게 역할 수행
  const clickEventHandler = () => {
    switch (stat) {
      case "ready":
        socket?.emit("reaction-game-ready", { roomID: roomCode });
        setStat("readyFinish");
        break;
      case "click":
        clearTimeout(timeout.current as NodeJS.Timeout);
        endTime.current = new Date();
        setStat("clickFinish");
        if (endTime.current !== undefined && startTime.current !== undefined) {
          const reactionSpeed: number = endTime.current.getTime() - startTime.current.getTime();
          setSpeed(reactionSpeed);
          socket?.emit("reaction-game-user-result", {
            roomID: roomCode,
            speed: reactionSpeed,
          });
        }
        break;
      case "wait":
        alert("너무 빨리 눌렀어요");
        break;
    }
  };

  return (
    <Container>
      <S.GameWrapper>
        <S.WhiteSpaceTop>
          <S.RoundContainer>
            <S.Round> {!round ? "준비" : `Round ${round}`} </S.Round>
          </S.RoundContainer>
        </S.WhiteSpaceTop>
        <S.GameMain>
          <S.PlayerLayout>
            <ParticipantList participant={participant.slice(0, 4)} />
          </S.PlayerLayout>
          <S.GameLayout>
            <ReactionButton stat={stat} onClick={clickEventHandler} speed={speed} />
          </S.GameLayout>
          <S.PlayerLayout>
            <ParticipantList participant={participant.slice(4, 8)} />
          </S.PlayerLayout>
        </S.GameMain>
        <S.WhiteSpaceBottom />
      </S.GameWrapper>
    </Container>
  );
};

export default Reaction;
