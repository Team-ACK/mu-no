import styled from "styled-components";

const S = {
  Button: styled.button`
    white-space: pre-wrap;
    margin: 7px;
    padding: 5px 20px;
    border: none;
    border-radius: 11px;
    box-sizing: border-box;
    cursor: pointer;
    ${(props) => props.theme.typography.reactionButton};

    background-color: ${(props: any) =>
      props.stat === "ready"
        ? "#2b87d1"
        : props.stat === "readyFinish"
        ? "#005eac"
        : props.stat === "wait"
        ? "#ce2636"
        : props.stat === "click"
        ? "#4bdb6a"
        : props.stat === "die"
        ? "black"
        : "#2b87d1"};

    width: 450px;
    height: 300px;
    color: ${(props) => props.theme.palette.white};
    &:focus {
      background-color: ${(props: any) =>
        props.stat === "ready"
          ? "#2b87d1"
          : props.stat === "readyFinsih"
          ? "#005eac"
          : props.stat === "wait"
          ? "#ce2636"
          : props.stat === "click"
          ? "#4bdb6a"
          : props.stat === "die"
          ? "black"
          : "#2b87d1"};
    }
    &:hover {
      ${(props: any) =>
        props.stat === "ready"
          ? "#2b87d1"
          : props.stat === "readyFinsih"
          ? "#005eac"
          : props.stat === "wait"
          ? "#ce2636"
          : props.stat === "click"
          ? "#4bdb6a"
          : props.stat === "die"
          ? "black"
          : "#2b87d1"};
    }
  `,
};

const ReactionButton: React.FC<any> = (props: any) => {
  const { stat, speed }: { stat: string; speed?: string } = props;
  const description =
    stat === "ready"
      ? "준비"
      : stat === "readyFinish"
      ? "준비 완료\n잠시 후 게임이 시작됩니다."
      : stat === "wait"
      ? "Wait for green"
      : stat === "click"
      ? "Click!"
      : stat === "die"
      ? "You Died"
      : // 클릭후 속도를 표시
        speed;

  return <S.Button {...props}>{description}</S.Button>;
};

export default ReactionButton;
