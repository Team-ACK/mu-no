import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Container } from "../../components";
import { HeaderElement, MainElement, FooterElement, SignUp } from "./components";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const S = {
  HeaderLayout: styled(LayoutStyle)`
    flex-basis: 26%;
  `,
  MainLayout: styled(LayoutStyle)`
    justify-content: space-between;
    padding: 0px 15px;
    flex-basis: 67%;
  `,
  FooterLayout: styled(LayoutStyle)`
    align-items: end;
    flex-basis: 7%;
  `,
};

const Home = () => {
  const { paramRoomCode } = useParams();
  const [modal, setModal] = useState<boolean>(false);
  return (
    <>
      {modal === true ? <SignUp modal={modal} setModal={setModal} /> : null}
      <Container>
        <>
          <S.HeaderLayout>
            <HeaderElement />
          </S.HeaderLayout>
          <S.MainLayout>
            <MainElement modal={modal} setModal={setModal} paramRoomCode={paramRoomCode} />
          </S.MainLayout>
          <S.FooterLayout>
            <FooterElement />
          </S.FooterLayout>
        </>
      </Container>
    </>
  );
};

export default Home;
