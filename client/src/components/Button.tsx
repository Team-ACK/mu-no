import styled from "styled-components";

interface StyledButtonType {
  buttonType: "primary" | "warning";
  disabled: boolean;
}

interface ButtonPropsType {
  buttonType?: "primary" | "warning";
  style?: React.CSSProperties;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const buttonPalette = {
  primary: {
    disabledColor: (disabled: boolean) => (disabled ? "#b8baff" : "#696eff"),
    hover: "#4d53fd",
  },
  warning: {
    disabledColor: (disabled: boolean) => (disabled ? "#ff8989" : "#ff4040"),
    hover: "#ff1d1d",
  },
};

const S = {
  Button: styled.button<StyledButtonType>`
    ${({ theme }) => theme.typography.button};
    margin: 7px;
    padding: 5px 20px;
    border: none;
    border-radius: 11px;
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    background-color: ${({ buttonType, disabled }) => buttonPalette[buttonType].disabledColor(disabled)};
    width: fit-content;
    height: 46px;
    color: ${(props) => props.theme.palette.white};
    &:focus {
      background-color: ${({ buttonType }) => buttonPalette[buttonType].hover};
    }
    &:hover {
      background-color: ${({ buttonType }) => buttonPalette[buttonType].hover};
    }
  `,
};

const Button = ({ children, style, onClick, buttonType = "primary", disabled = false }: ButtonPropsType) => (
  <S.Button style={style} buttonType={buttonType} disabled={disabled} onClick={onClick}>
    {children}
  </S.Button>
);

export default Button;
