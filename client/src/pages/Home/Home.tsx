import styled from "styled-components";
import { Container, TextField } from "../../components";
import { FooterElement, MainElement } from "./components";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  // border: 1px solid red;
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
  return (
    <Container>
      <>
        <S.HeaderLayout>
          <h1>헤더</h1>
        </S.HeaderLayout>
        <S.MainLayout>
          <MainElement />
        </S.MainLayout>
        <S.FooterLayout>
          <FooterElement />
        </S.FooterLayout>
      </>
    </Container>
  );
};

export default Home;
