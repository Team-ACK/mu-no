import styled from "styled-components";

interface StyledButtonType {
  buttonType: "primary" | "secondary" | "warning";
  disabled: boolean;
}

interface ButtonPropsType {
  buttonType?: "primary" | "secondary" | "warning";
  style?: React.CSSProperties;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const buttonPalette = {
  primary: {
    disabledColor: (disabled: boolean) => (disabled ? "#b8baff" : "#696eff"),
    border: "none",
    hover: "#4d53fd",
  },
  secondary: {
    disabledColor: (disabled: boolean) => (disabled ? "#ffffff" : "#ffffff"),
    border: "1.6px solid #696eff",
    hover: "#f8f8f8",
  },
  warning: {
    disabledColor: (disabled: boolean) => (disabled ? "#ff8989" : "#ff4040"),
    border: "none",
    hover: "#ff1d1d",
  },
};

const S = {
  Button: styled.button<StyledButtonType>`
    ${({ theme }) => theme.typography.button};
    margin: 7px;
    padding: 5px 20px;
    border: ${({ buttonType }) => buttonPalette[buttonType].border};
    border-radius: 11px;
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    background-color: ${({ buttonType, disabled }) => buttonPalette[buttonType].disabledColor(disabled)};
    width: fit-content;
    height: 46px;
    color: ${({ theme, buttonType }) => (buttonType === "secondary" ? "#696eff" : theme.palette.white)};
    &:focus {
      background-color: ${({ buttonType, disabled }) =>
        disabled ? buttonPalette[buttonType].disabledColor(true) : buttonPalette[buttonType].hover};
    }
    &:hover {
      background-color: ${({ buttonType, disabled }) =>
        disabled ? buttonPalette[buttonType].disabledColor(true) : buttonPalette[buttonType].hover};
    }
  `,
};

const Button = ({ children, style, onClick, buttonType = "primary", disabled = false }: ButtonPropsType) => (
  <S.Button style={style} buttonType={buttonType} disabled={disabled} onClick={onClick}>
    <p>{children}</p>
  </S.Button>
);

export default Button;
