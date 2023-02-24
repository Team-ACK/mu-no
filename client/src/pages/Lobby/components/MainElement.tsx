import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { socketStore, lobbyStore, userStore } from "../../../store";
import { Button, UserCard } from "../../../components";
import DropDown from "../../../assets/img/dropdown.svg";

const LayoutStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
`;

const S = {
  MainWrapper: styled(LayoutStyle)`
    flex-direction: row;
    justify-content: space-between;
    border: none;
    height: 100%;
  `,
  PlayerListWrapper: styled(LayoutStyle)`
    flex-basis: 34%;
    height: 100%;
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
    height: 90.7%;
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
  GameListWrapper: styled(LayoutStyle)`
    flex-basis: 64.2%;
  `,
};

const MainElement = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { socket } = socketStore();
  const { isHost, roomCode } = userStore();
  const { userList, headCount } = lobbyStore();

  const [population, setPopulation] = useState(8);
  const [element, setElement] = useState<JSX.Element[]>([]);

  const populationList: number[] = [2, 3, 4, 5, 6, 7, 8];
  // const inviteCode = "http://localhost:8080".concat(location.pathname.split("/lobby")[0]);
  const inviteCode = "http://muno.fun".concat(location.pathname.split("/lobby")[0]);
  const optionList: JSX.Element[] = populationList.map((data) => {
    return (
      <option value={data} key={data}>
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
            divWidth="50px"
            profileColor={`${userList[i].userColor}`}
            nickname={`${userList[i].nickname}`}
            isMe={socket?.id === userList[i].socketID}
          >
            <p>{userList[i].admin === true ? "방장" : "유저"}</p>
          </UserCard>
        ) : (
          <UserCard divWidth="50px" profileColor="black" nickname="비어있음">
            <p> </p>
          </UserCard>
        )
      );
    }
    setElement(temp);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const max = parseInt(e.currentTarget.value, 10);

    if (max < parseInt(headCount, 10)) {
      alert("최대 인원은 현재 인원보다 적을 수 없습니다");
      return;
    }
    socket?.emit("set-max-players", { roomID: roomCode, maxPlayers: max });
  };

  const gameStart = () => {
    if (socket) {
      socket.emit("reaction-selected", {
        roomID: roomCode,
      });
    }
  };

  const generateInviteCode = () => {
    try {
      alert("클립보드에 복사되었습니다.");
    } catch (error) {
      alert("클립보드 복사에 실패하였습니다.");
    }
  };

  useEffect(() => {
    socket?.on("reaction-selected", () => {
      navigate(`/${roomCode}/reaction`);
    });
    socket?.on("get-max-players", ({ maxPlayers }) => {
      setPopulation(maxPlayers);
    });
    socket?.emit("get-max-players", { roomID: roomCode }, ({ maxPlayers }: { maxPlayers: number }) => {
      setPopulation(maxPlayers);
    });

    return () => {
      socket?.off("reaction-selected");
      socket?.off("get-max-players");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    addUserLayout();
    // eslint-disable-next-line
  }, [population, userList]);

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
              {isHost ? (
                <S.PlayerSelectorLabel>
                  <S.PlayerSelector onChange={handleSelect} value={population}>
                    {optionList}
                  </S.PlayerSelector>
                </S.PlayerSelectorLabel>
              ) : (
                <p>플레이어 {population}</p>
              )}
            </S.PlayerCountLayout>
          </S.SelectorLayout>
          <S.PlayerListLayout>{element}</S.PlayerListLayout>
        </S.PlayerListBottom>
      </S.PlayerListWrapper>

      <S.GameListWrapper>
        {isHost === true ? (
          <Button onClick={gameStart}>게임 시작</Button>
        ) : (
          <div>방장이 게임을 시작할 때 까지 기다려 주세요 :)</div>
        )}
        <CopyToClipboard text={inviteCode}>
          <Button onClick={generateInviteCode}>초대 코드 복사</Button>
        </CopyToClipboard>
      </S.GameListWrapper>
    </S.MainWrapper>
  );
};

export default MainElement;
