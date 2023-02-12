import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { lobbyStore } from "../../store";
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
    flex-direction: row;
  `,
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

  const fun = () => {
    const copy = JSON.parse(JSON.stringify(userList));
    for (const element of copy) {
      element.isDied = false;
    }
    return copy;
  };
  const [participant, setParticipant] = useState<participantType[]>(fun);

  const [stat, setStat] = useState<string>("ready");

  const [speed, setSpeed] = useState<string>("0 ms");

  const [element, setElement] = useState<JSX.Element[]>([]);

  const timeout = useRef(null);
  const startTime = useRef();
  const endTime = useRef();

  const addUserLayout = () => {
    const temp: JSX.Element[] = [];
    for (let i = 0; i < 8; i += 1) {
      temp.push(
        participant[i] ? (
          <UserCard profileColor={`${participant[i].userColor}`} nickname={`${participant[i].nickname}`}>
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
  }, []);

  useEffect(() => {
    // 소켓 on - stat이 die 가 아닐때 시간을 받는다면 stat을 wait으로 변경하고 n초뒤에 stat을 click로 바꿈
    // 소켓 on - stat이 die 가 아닐때 사용자들의 결과를 받는다면 sort후 탈락자 선별, 탈락자의 UserCard에 탈락을 표시하고 만약
    // 자신이 탈락했다면, stat을 die로 변경함
  }, []);

  const sendReady = () => {
    // 소켓 emit
    setStat("readyFinish");
  };

  const sendSpeed = () => {
    // 소켓 emit
    setStat("");
  };

  return (
    <Container>
      <S.GameWrapper>
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
      </S.GameWrapper>
    </Container>
  );
};

export default Reaction;
