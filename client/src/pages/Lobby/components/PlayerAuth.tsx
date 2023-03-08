import styled from "styled-components";
import { ReactComponent as HostIcon } from "../../../assets/img/host.svg";
import { ReactComponent as KickIcon } from "../../../assets/img/kick.svg";

type Props = {
  useradmin: boolean;
  isHost: boolean;
  kickPlayer(event: React.MouseEvent<HTMLElement>): void;
  index: number;
};

const S = {
  PlayerAuth: styled.div<{ useradmin: boolean; isHost: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    /* border: ${({ useradmin }: { useradmin: boolean }) =>
      useradmin === true ? "1px solid gold" : "2px solid red"}; */
    cursor: ${({ useradmin }: { useradmin: boolean }) => (useradmin === true ? "default" : "pointer")};
  `,
};

const PlayerAuth: React.FC<Props> = ({ useradmin, isHost, kickPlayer, index }: Props) => {
  return (
    <>
      {}
      {isHost ? (
        useradmin ? (
          <S.PlayerAuth useradmin={useradmin} isHost={isHost} onClick={kickPlayer} data-react-key={index}>
            <HostIcon fill="gold" width="25px" height="25px" />
          </S.PlayerAuth>
        ) : (
          <S.PlayerAuth useradmin={useradmin} isHost={isHost} onClick={kickPlayer} data-react-key={index}>
            <KickIcon fill="red" width="25px" height="25px" />
          </S.PlayerAuth>
          // <> </>
        )
      ) : useradmin ? (
        <S.PlayerAuth useradmin={useradmin} isHost={isHost} onClick={kickPlayer} data-react-key={index}>
          <HostIcon fill="gold" width="25px" height="25px" />
        </S.PlayerAuth>
      ) : (
        <> </>
      )}
    </>
  );
};

export default PlayerAuth;
