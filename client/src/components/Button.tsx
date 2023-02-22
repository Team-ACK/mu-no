import styled from "styled-components";

const S = {
  Button: styled.button`
    margin: 7px;
    padding: 5px 20px;
    border: none;
    border-radius: 11px;
    cursor: pointer;
    ${(props) => props.theme.typography.button};
    background-color: ${(props: any) => (props.red === "true" ? "#ff4040" : "#696eff")};
    width: ${({ size }: { size: string | undefined }) => (typeof size === "string" ? size : "fit-content")};
    height: 46px;
    color: ${(props) => props.theme.palette.white};
    &:focus {
      background-color: ${(props: any) => (props.red === "true" ? "#ff1d1d" : "#4d53fd")};
    }
    &:hover {
      background-color: ${(props: any) => (props.red === "true" ? "#ff1d1d" : "#4d53fd")};
    }
  `,
};

const Button: React.FC<any> = (props) => <S.Button {...props} />;

export default Button;
