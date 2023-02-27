import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socketStore, userStore, lobbyStore, modalHandleStore } from "../../store";
import { Container, UserCard } from "../../components";
import { ReactionButton } from "./components";
import usePreventWrongApproach from "../../hooks/usePreventWrongApproach";

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

type participantType = {
  admin: boolean;
  nickname: string;
  userColor: string;
  socketID: string;
  isDied: boolean;
  recentSpeed: number;
};

const Reaction = () => {
  const location = useLocation();
  usePreventWrongApproach(location.pathname);

  const { userList, setUserList, setHeadCount } = lobbyStore();
  const { setModal } = modalHandleStore();

  const addDiedProps = () => {
    const copy = JSON.parse(JSON.stringify(userList));
    for (const element of copy) {
      element.isDied = false;
      element.recentSpeed = 0;
    }
    return copy;
  };

  const [round, setRound] = useState(0);
  const [participant, setParticipant] = useState<participantType[]>(addDiedProps);
  const [stat, setStat] = useState<string>("ready");
  const [speed, setSpeed] = useState<number>(0);
  const [element, setElement] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newParticipant: participantType[] = [];

    const sockets: string[] = [];
    userList.map((data) => {
      return sockets.push(data.socketID);
    });
    participant.forEach((data, _) => {
      if (sockets.includes(data.socketID)) {
        newParticipant.push(data);
      }
    });
    setParticipant(newParticipant);
  }, [userList]); // eslint-disable-line

  const { socket } = socketStore();
  const { nickname, roomCode } = userStore();

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
            speed={participant[i].recentSpeed.toString()}
            divWidth="58px"
            profileColor={`${participant[i].userColor}`}
            nickname={`${participant[i].nickname}`}
            isMe={socket?.id === userList[i].socketID}
          >
            {participant[i].isDied ? (
              <>
                <p style={{ display: "flex" }}>사망</p>
                <span style={{ marginLeft: "3px" }}>❌</span>
              </>
            ) : (
              <>
                <p style={{ display: "flex" }}>생존</p>
                <span style={{ marginLeft: "3px" }}>✅</span>
              </>
            )}
          </UserCard>
        ) : (
          <UserCard divWidth="54px" profileColor="black" nickname="비어있음">
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
    socket?.on("reaction-game-round-start", ({ randomTime }: { randomTime: number }) => {
      renderDelay.current = setTimeout(() => {
        if (stat !== "die") {
          setStat("wait");
        }
        setRound(round + 1);
        setParticipant(() => {
          const copy = JSON.parse(JSON.stringify(participant));
          for (const temp of copy) {
            temp.recentSpeed = 0;
          }
          return copy;
        });
      }, 1500);
      if (stat !== "die") {
        timeout.current = setTimeout(() => {
          setStat("click");
          startTime.current = new Date();
        }, randomTime);
      }
    });
    // 소켓 on - stat이 die 가 아닐때 사용자들의 결과를 받는다면 sort후 탈락자 선별, 탈락자의 UserCard에 탈락을 표시하고 만약
    // 자신이 탈락했다면, stat을 die로 변경함
    socket?.on(
      "reaction-game-round-result",
      ({ getGameResult }: { getGameResult: { socketID: string; speed: number }[] }) => {
        const maxResult = getGameResult.reduce((prev, next) => {
          return prev.speed >= next.speed ? prev : next;
        });
        if (socket.id === maxResult.socketID) {
          setStat("die");
        }
        const copy = JSON.parse(JSON.stringify(participant));
        for (const temp of copy) {
          if (!temp.isDied) {
            for (const asd of getGameResult) {
              if (temp.socketID === asd.socketID) {
                temp.recentSpeed = asd.speed;
              }
            }
          }
          if (temp.socketID === maxResult.socketID) {
            temp.isDied = true;
          }
        }
        setParticipant(copy);
      }
    );

    socket?.on("admin-exit", () => {
      setModal("HostDisconnected");
    });

    return () => {
      socket?.off("reaction-game-round-start");
      socket?.off("reaction-game-round-result");
      socket?.off("admin-exit");
    };
    // eslint-disable-next-line
  });

  useEffect(() => {
    if (!nickname) {
      // const url = "http://localhost:8080";
      const url = "http://muno.fun";
      window.location.replace(url);
    }

    socket?.on("user-list", (data: { userList: any }) => {
      setUserList(data.userList);
      setHeadCount(data.userList.length);
    });

    return () => {
      socket?.off("user-list");
    };
  }, []); // eslint-disable-line

  return (
    <Container>
      <S.GameWrapper>
        <S.WhiteSpaceTop>
          <S.RoundContainer>
            <S.Round> {!round ? "준비" : `Round ${round}`}</S.Round>
          </S.RoundContainer>
        </S.WhiteSpaceTop>
        <S.GameMain>
          <S.PlayerLayout>{element.slice(0, 4)}</S.PlayerLayout>
          <S.GameLayout>
            {stat === "ready" ? (
              <ReactionButton stat={stat} onClick={sendReady} />
            ) : stat === "click" ? (
              <ReactionButton stat={stat} onClick={sendSpeed} />
            ) : stat === "wait" ? (
              <ReactionButton
                stat={stat}
                onClick={() => {
                  alert("너무 빨리 눌렀어요.");
                }}
              />
            ) : (
              <ReactionButton disabled stat={stat} speed={speed} />
            )}
          </S.GameLayout>
          <S.PlayerLayout>{element.slice(-4)}</S.PlayerLayout>
        </S.GameMain>
        <S.WhiteSpaceBottom />
      </S.GameWrapper>
    </Container>
  );
};

export default Reaction;
