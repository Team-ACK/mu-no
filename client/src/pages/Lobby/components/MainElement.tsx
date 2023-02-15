import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { socketStore, lobbyStore, userStore } from "../../../store";
import { Button, UserCard } from "../../../components";
import DropDown from "../../../assets/img/dropdown.svg";
// 모든 styled component 및 import 리팩토링 필요

const LayoutStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;
const WrapperStyle = styled(LayoutStyle)`
  /* border: 1px solid blue; */
`;

const S = {
  MainWrapper: styled(WrapperStyle)`
    flex-direction: row;
    justify-content: space-between;
    border: none;
  `,
  PlayerListWrapper: styled(WrapperStyle)`
    flex-basis: 34%;
  `,

  PlayerListTop: styled(LayoutStyle)`
    flex-direction: row;
    border: 1px solid skyblue;
    flex-basis: 9.3%;
  `,
  Player: styled(LayoutStyle)`
    flex-direction: row;
    justify-content: start;
    margin-left: 15px;
  `,
  PlayerCount: styled(LayoutStyle)`
    flex-direction: row;
    justify-content: end;
    margin-right: 15px;
  `,

  PlayerListBottom: styled(LayoutStyle)`
    border: 1px solid skyblue;
    flex-basis: 90.7%;
  `,

  SelectorLayout: styled(LayoutStyle)`
    border: 1px solid purple;
    flex-basis: 12.6%;
  `,
  PlayerCountLayout: styled(LayoutStyle)`
    width: 80%;
  `,
  PlayerSelectorLabel: styled.label`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before {
      content: "";
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 50px;
      background-image: url(${DropDown});
      background-repeat: no-repeat;
      background-position: center center;
    }
  `,
  PlayerSelector: styled.select`
    z-index: 2;
    background: transparent;
    appearance: none;
    width: 80%;
    height: 70%;
    border-radius: 12px;
    padding-left: 10px;
    font-size: 18px;

    &:focus {
      outline: none;
    }
  `,
  PlayerListLayout: styled(LayoutStyle)`
    justify-content: start;
    border: 1px solid purple;
    flex-basis: 87.4%;
    overflow-y: overlay;
    &::-webkit-scrollbar {
      width: 7px;
    }
  `,

  GameListWrapper: styled(WrapperStyle)`
    flex-basis: 64.2%;
  `,
};

const MainElement = () => {
  const navigate = useNavigate();
  const populationList: number[] = [2, 3, 4, 5, 6];

  const [population, setPopulation] = useState(4);

  const [element, setElement] = useState<JSX.Element[]>([]);

  const { socket } = socketStore();
  const { isHost, roomCode } = userStore();
  const { userList, headCount } = lobbyStore();

  useEffect(() => {
    if (socket) {
      socket.on("reaction-selected", () => {
        navigate(`/${roomCode}/reaction`);
      });
    }
    return () => {
      if (socket) {
        socket.off("reaction-selected");
      }
    };

    // eslint-disable-next-line
  }, []);

  const optionList: JSX.Element[] = populationList.map((data, index) => {
    return (
      <option value={data} key={index}>
        플레이어 {data}명
      </option>
    );
  });

  const addUserLayout = () => {
    const temp: JSX.Element[] = [];

    for (let i = 0; i < population; i += 1) {
      temp.push(
        userList[i] ? (
          <UserCard
            profileColor={`${userList[i].userColor}`}
            nickname={`${userList[i].nickname}`}
            isMe={socket?.id === userList[i].socketID}
          >
            <p>{userList[i].admin === true ? "방장임" : "딱가리임"}</p>
          </UserCard>
        ) : (
          <UserCard profileColor="black" nickname="비어있음">
            <p>x</p>
          </UserCard>
        )
      );
    }
    setElement(temp);
  };

  useEffect(() => {
    addUserLayout();
  }, [userList]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPopulation(parseInt(e.currentTarget.value, 10));
  };

  const gameStart = () => {
    if (socket) {
      socket.emit("reaction-selected", {
        roomID: roomCode,
      });
    }
  };

  return (
    <S.MainWrapper>
      <S.PlayerListWrapper>
        <S.PlayerListTop>
          <S.Player>
            <p>플레이어</p>
          </S.Player>

          <S.PlayerCount>
            <p>
              {headCount}/{population}
            </p>
          </S.PlayerCount>
        </S.PlayerListTop>

        <S.PlayerListBottom>
          <S.SelectorLayout>
            <S.PlayerCountLayout>
              <S.PlayerSelectorLabel>
                <S.PlayerSelector onChange={handleSelect} value={population}>
                  {optionList}
                </S.PlayerSelector>
              </S.PlayerSelectorLabel>
            </S.PlayerCountLayout>
          </S.SelectorLayout>

          <S.PlayerListLayout>{element}</S.PlayerListLayout>
        </S.PlayerListBottom>
      </S.PlayerListWrapper>

      <S.GameListWrapper>
        {isHost === true ? (
          <Button onClick={gameStart}>게임 시작</Button>
        ) : (
          <div>방장이 게임을 시작할 때 까지 대기해 주세요 :)</div>
        )}
      </S.GameListWrapper>
    </S.MainWrapper>
  );
};

export default MainElement;
