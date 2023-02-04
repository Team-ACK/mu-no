import styled from "styled-components";

const LayoutStyle = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.palette.black};
  height: 87.8%;
  border-radius: 12px;
`;
const S = {
  LoginForm: styled(LayoutStyle)`
    flex-basis: 59.5%;
  `,

  GameDescriptionLayout: styled(LayoutStyle)`
    flex-basis: 37.4%;
  `,
};

const MainElement = () => {
  return (
    <>
      <S.LoginForm />
      <S.GameDescriptionLayout />
    </>
  );
};
export default MainElement;
