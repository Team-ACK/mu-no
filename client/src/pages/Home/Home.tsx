import styled from "styled-components";
import { Container } from "../../components";

const LayoutStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 1px solid red;
`;

const S = {
  HeaderLayout: styled(LayoutStyle)`
    flex-grow: 6;
  `,
  MainLayout: styled(LayoutStyle)`
    flex-grow: 15;
  `,
  FooterLayout: styled(LayoutStyle)`
    flex-grow: 2;
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
          <h1>메인</h1>
        </S.MainLayout>
        <S.FooterLayout>
          <h1>푸터</h1>
        </S.FooterLayout>
      </>
    </Container>
  );
};

export default Home;
