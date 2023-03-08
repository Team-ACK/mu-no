import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socketStore, userStore, lobbyStore, modalHandleStore } from "../../store";
import { Container } from "../../components";
import { ReactionButton, ParticipantList, Result } from "./components";
import usePreventWrongApproach from "../../hooks/usePreventWrongApproach";
import { HOST_URL } from "../../utils/envProvider";
import UserType from "../../store/types/UserType";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

interface ParticipantType extends UserType {
  speedList: number[];
  recentSpeed: number; // for Render
  isDied: boolean;
  isExit: boolean;
}

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
  const { nickname, roomCode, isHost } = userStore();
  const { userList, setUserList, setHeadCount, setIsComeBack } = lobbyStore();
  const { setModal } = modalHandleStore();

  // local status
  const [gameResult, setGameResult] = useState<
    | {
        isExit: boolean;
        rank: number;
        isMe: boolean;
        userColor: string;
        nickname: string;
        avgSpeed: number;
        minSpeed: number;
      }[]
    | null
  >(null);
  const [round, setRound] = useState<number>(0); // 0: round 시작 전, -1: 게임 종료
  const [stat, setStat] = useState<"ready" | "readyFinish" | "wait" | "click" | "clickFinish" | "die">("ready");
  const [speed, setSpeed] = useState<number | null>(null);
  const [participant, setParticipant] = useState<ParticipantType[]>(() =>
    userList.map((user) => {
      return { ...user, isDied: false, recentSpeed: 0, isExit: false, speedList: [] };
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
      const url = HOST_URL;
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
      }, 3000);

      if (stat !== "die") {
        timeout.current = setTimeout(() => {
          setStat("click");
          startTime.current = new Date();
        }, randomTime);
      }
    });

    socket?.on(
      "reaction-game-round-result",
      ({ getGameResult }: { getGameResult: { socketID: string; speed: number; isAlive: boolean }[] }) => {
        // 자신의 사망을 처리
        const filterdMeData = getGameResult.filter((data) => data.socketID === socket.id);
        if (filterdMeData.length === 1) {
          if (!filterdMeData[0].isAlive) {
            setStat("die");
          }
        }
        setParticipant(
          participant.map((user) => {
            const filteredAllData: any = getGameResult.filter((data) => data.socketID === user.socketID);
            if (filteredAllData.length === 1) {
              console.log(!filteredAllData[0].isAlive);
              return {
                ...user,
                recentSpeed: filteredAllData[0].speed,
                speedList: [...user.speedList, filteredAllData[0].speed],
                isDied: !filteredAllData[0].isAlive,
              };
            }
            return user; // 이미 탈락한 사용자
          })
        );

        if (isHost) {
          socket?.emit("reaction-game-next-round", { roomID: roomCode, last: false });
        }
      }
    );

    socket?.on("admin-exit", () => {
      setModal("HostDisconnected");
    });

    if (isHost) {
      socket?.on("reaction-last-user-exit", () => {
        socket?.emit("reaction-game-next-round", { roomID: roomCode, last: true });
      });
      socket?.on("reaction-no-ready-last-user-exit", () => {
        socket?.emit("reaction-game-ready", { roomID: roomCode });
      });
    }

    socket?.on("reaction-game-end", (_: any) => {
      setIsComeBack(true);
      setRound(-1);

      // 순위 알고리즘
      const getResult = () =>
        participant
          .sort((prev, next) => {
            if (prev.isExit !== next.isExit) {
              return prev.isExit ? 1 : -1;
            }
            if (prev.speedList.length !== next.speedList.length) {
              return next.speedList.length - prev.speedList.length;
            }
            if (prev.isDied !== next.isDied) {
              return prev.isDied ? 1 : -1;
            }
            return 0;
          })
          .map((item, index) => {
            return {
              isExit: item.isExit,
              rank: index + 1,
              isMe: socket.id === item.socketID,
              userColor: item.userColor,
              nickname: item.nickname,
              avgSpeed: item.speedList.reduce((p, c) => p + c, 0) / item.speedList.length,
              minSpeed: Math.min.apply(null, item.speedList),
            };
          });
      renderDelay.current = setTimeout(() => {
        setGameResult(getResult());
      }, 500);
    });

    return () => {
      socket?.off("user-list");
      socket?.off("reaction-game-round-start");
      socket?.off("reaction-game-round-result");
      socket?.off("admin-exit");
      socket?.off("reaction-last-user-exit");
      socket?.off("reaction-game-end");
      socket?.off("reaction-last-user-exit");
      socket?.off("reaction-no-ready-last-user-exit");
    };
  }, [socket, isHost, roomCode, participant, stat, round]);

  // Handle Participant - 참가자가 게임을 나가는 경우에 대한 처리
  useEffect(() => {
    setParticipant(
      participant.map((user) => ({ ...user, isExit: !userList.some((item) => item.socketID === user.socketID) }))
    );
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
    <>
      {gameResult && <Result gameResultData={gameResult} />}
      <Container>
        <S.GameWrapper>
          <S.WhiteSpaceTop>
            <S.RoundContainer>
              <S.Round> {!round ? "준비" : round === -1 ? "게임 종료" : `Round ${round}`} </S.Round>
            </S.RoundContainer>
          </S.WhiteSpaceTop>
          <S.GameMain>
            <S.PlayerLayout>
              <ParticipantList participant={participant.filter((user) => !user.isExit).slice(0, 4)} />
            </S.PlayerLayout>
            <S.GameLayout>
              <ReactionButton stat={stat} onClick={clickEventHandler} speed={speed} />
            </S.GameLayout>
            <S.PlayerLayout>
              <ParticipantList participant={participant.filter((user) => !user.isExit).slice(4, 8)} />
            </S.PlayerLayout>
          </S.GameMain>
          <S.WhiteSpaceBottom />
        </S.GameWrapper>
      </Container>
    </>
  );
};

export default Reaction;
