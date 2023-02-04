import styled from "styled-components";
import { userStore } from "../../store";

const Lobby = () => {
  const { nickname, userColor } = userStore();

  return (
    <div>
      {userColor} {nickname}
    </div>
  );
};

export default Lobby;
