import styled from "styled-components";
import { Button } from "../../components";

const CommonStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const NonContentStyle = styled(CommonStyle)`
  width: 100%;
  flex-basis: 15%;
  color: ${(props) => props.theme.typography.button};
`;
const ContentStyle = styled(CommonStyle)`
  color: gray;
  width: 100%;
  flex-basis: 19%;
  align-items: start;
`;

const InputLayoutStyle = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
`;

const S = {
  Top: styled(NonContentStyle)`
    color: #696eff;
    font-weight: 700;
    font-size: 35px;
  `,
  Bottom: styled(NonContentStyle)`
    margin-top: 20px;
  `,
  EmailLayout: styled(ContentStyle)``,
  EmailInput: styled(InputLayoutStyle)``,
};

const HostDisconnected = () => {
  return (
    <>
      <S.Top>
        <p>알림</p>
      </S.Top>
      <p style={{ fontSize: "22px", marginBottom: "5px" }}>방장이 방을 떠났습니다.</p>
      <p style={{ fontSize: "22px", marginBottom: "5px" }}>새로 게임을 시작해 주세요.</p>
      <S.Bottom>
        <Button
          style={{ width: "40%", height: "55px" }}
          onClick={() => {
            window.location.replace("/");
          }}
        >
          홈으로 돌아가기
        </Button>
      </S.Bottom>
    </>
  );
};

export default HostDisconnected;
