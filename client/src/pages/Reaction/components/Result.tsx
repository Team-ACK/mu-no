import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../store";
import styled, { keyframes } from "styled-components";

const boxFade = (nowScale: number) => keyframes`
  0% {
     opacity: 0;
    transform: translateY(400px) scale(${0.75 * nowScale});
  }
  75% {
    opacity: 1; 
    transform: translateY(-16px) scale(${nowScale});
  }
  100% {
    opacity: 1; 
    transform: translateY(0px) scale(${nowScale});
  }
`;

const CommonStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const NonContentStyle = styled(CommonStyle)`
  width: 100%;
  color: ${(props) => props.theme.typography.button};
`;

const S = {
  Background: styled.div`
    width: 1200px;
    height: 800px;
    position: absolute;
    left: calc(100vw / 2 - 600px);
    top: calc(100vh / 2 - 400px);
    background: rgba(231, 231, 231, 0.5);
    z-index: 1;
    padding: 30px;
  `,
  Wrapper: styled.div<{ nowScale: number }>`
    z-index: 1;
    animation: 0.4s ease-in-out 0s 1 normal forwards running ${({ nowScale }) => boxFade(nowScale)};
    background: white;
    position: absolute;
    left: calc(100vw / 2 - 500px);
    top: calc(100vh / 2 - 350px);
    border-radius: 12px;
  `,
  InnerContainer: styled(CommonStyle)`
    width: 1000px;
    height: 700px;
    padding: 15px 20px;
    border: 1px solid ${(props) => props.theme.palette.borderColor};
    box-shadow: 0px 0px 30px 2px ${(props) => props.theme.palette.shadowColor};
  `,
  Top: styled(NonContentStyle)`
    color: #696eff;
    font-weight: 700;
    font-size: 35px;
    flex-basis: 25%;
    border-radius: 0px;
    border-bottom: 1px solid darkgray;
  `,
  Main: styled(NonContentStyle)`
    justify-content: start;
    flex-basis: 70%;
  `,
  Bottom: styled(NonContentStyle)`
    flex-basis: 5%;
    margin-top: 20px;
    align-items: end;
    font-size: 18px;
  `,
  Table: styled.table`
    border-collapse: collapse;
    width: 100%;
    th,
    td {
      color: #464646;
      text-align: center;
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }
    th {
      color: black;
      font-weight: 550;
      text-align: center;
      background-color: #f2f2f2;
    }
  `,
};

const Result = ({
  gameResultData,
}: {
  gameResultData: {
    isExit: boolean;
    rank: number;
    isMe: boolean;
    userColor: string;
    nickname: string;
    avgSpeed: number;
    minSpeed: number;
  }[];
}) => {
  const [scale, setScale] = useState<number>(Math.min(window.innerWidth / 1400, window.innerHeight / 900));

  const handleResize = () => {
    setScale(Math.min(window.innerWidth / 1400, window.innerHeight / 900));
  };

  const navigate = useNavigate();
  const { roomCode } = userStore();

  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) {
      navigate(`/${roomCode}/lobby`);
    }
    const intervalId = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);

  useEffect(() => {
    console.log(gameResultData);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <S.Background style={{ transform: `scale(${scale})` }} />
      <S.Wrapper nowScale={scale}>
        <S.InnerContainer>
          <S.Top>게임 결과</S.Top>
          <hr style={{ border: "none", height: "20px" }} />
          <S.Main>
            <S.Table>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>닉네임</th>
                  <th>평균 기록</th>
                  <th>최고 기록</th>
                </tr>
              </thead>
              <tbody>
                {gameResultData.map((data) => (
                  <tr>
                    <td>{data.isExit ? "퇴장" : `${data.rank}등`}</td>
                    {data.isMe ? (
                      <td style={{ color: "#01b701", fontWeight: "bold" }}>{data.nickname}</td>
                    ) : (
                      <td style={{ color: "black" }}>{data.nickname}</td>
                    )}
                    <td>{isNaN(data.avgSpeed) ? "X" : `${parseFloat(data.avgSpeed.toFixed(1))}ms`}</td>
                    <td>{!isFinite(data.avgSpeed) ? "X" : `${parseFloat(data.minSpeed.toFixed(1))}ms`}</td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.Main>
          <S.Bottom>{seconds}초 후 로비로 이동</S.Bottom>
        </S.InnerContainer>
      </S.Wrapper>
    </>
  );
};

export default Result;
