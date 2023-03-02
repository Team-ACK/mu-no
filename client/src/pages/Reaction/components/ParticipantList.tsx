import { UserCard } from "../../../components";
import { socketStore } from "../../../store";

// : React.FC<any>
type ParticipantType = {
  admin: boolean;
  nickname: string;
  userColor: string;
  socketID: string;
  isDied: boolean;
  recentSpeed: number;
};

const ParticipantList = ({ participant }: { participant: ParticipantType[] }) => {
  const { socket } = socketStore();
  return (
    <>
      {participant.map((data) => (
        <UserCard
          speed={data.recentSpeed.toString()}
          divWidth="58px"
          profileColor={`${data.userColor}`}
          nickname={`${data.nickname}`}
          isMe={socket?.id === data.socketID}
          usage="Reaction"
        >
          <>
            <p style={{ display: "flex" }}>{data.isDied ? "사망" : "생존"}</p>
            <span style={{ marginLeft: "3px" }}>{data.isDied ? "❌" : "✅"}</span>
          </>
        </UserCard>
      ))}
      {Array(4 - participant.length).fill(
        <UserCard divWidth="54px" profileColor="black" nickname="비어있음" usage="Reaction">
          <p> </p>
        </UserCard>
      )}
    </>
  );
};

export default ParticipantList;
