import styled from "styled-components";
import { Button } from "../../../components";
import { ReactComponent as DropDown } from "../../../assets/img/dropdown.svg";

const FlexAlignStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LayoutStyle = styled(FlexAlignStyle)`
  flex-direction: row;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const S = {
  Wrapper: styled(LayoutStyle)``,
  LeftLayout: styled(LayoutStyle)`
    justify-content: start;
    align-items: start;
  `,
  MainLayout: styled(LayoutStyle)``,
  RightLayout: styled(LayoutStyle)``,
  AlignLayout: styled(FlexAlignStyle)``,
};
const HeaderElement = () => {
  const goPrevPage = () => {
    window.location.replace("/");
  };
  return (
    <S.Wrapper>
      <S.LeftLayout>
        <Button buttonType="secondary" onClick={goPrevPage}>
          <S.AlignLayout>
            <DropDown style={{ transform: "rotate(90deg)" }} width="25px" height="25px" fill="#6962ff" />
            <p style={{ fontWeight: "500", marginBottom: "2px" }}>뒤로가기</p>
          </S.AlignLayout>
        </Button>
      </S.LeftLayout>
      <S.MainLayout>
        <h1 style={{ fontSize: "35px", fontWeight: "bold" }}>로비</h1>
      </S.MainLayout>
      <S.RightLayout />
    </S.Wrapper>
  );
};

export default HeaderElement;
