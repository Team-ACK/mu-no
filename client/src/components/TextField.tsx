import styled from "styled-components";

interface StyledTextFieldType {
  disabled: boolean;
  fieldType: "primary" | "warning";
  type: string | undefined;
}

interface TextFieldPropsType {
  disabled?: boolean;
  type?: string;
  fieldType?: "primary" | "warning";
  placeholder?: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  value?: string;
  style?: React.CSSProperties;
}

const textFieldPalette = {
  isDisabled: (disabled: boolean) => (disabled ? "#f8f8f8" : "initial"),
  primary: {
    borderColor: "1px solid rgb(0, 0, 0, 0.2)",
    focus: "1px solid #808088",
  },
  warning: {
    borderColor: "1.5px solid #ff3d3d",
    focus: "1.5px solid #ff3333",
  },
};

const S = {
  Field: styled.input<StyledTextFieldType>`
    ${({ theme }) => theme.typography.caption};
    border: ${({ fieldType }) => textFieldPalette[fieldType].borderColor};
    background-color: ${({ disabled }) => textFieldPalette.isDisabled(disabled)};
    border-radius: 11px;
    height: 46px;
    margin: 7px;
    padding: 5px 10px;
    :focus {
      outline: none;
      border: ${({ fieldType }) => textFieldPalette[fieldType].focus};
    }
    ::placeholder {
      color: #bdbdbd;
    }
  `,
};

const TextField = ({
  disabled = false,
  type,
  fieldType = "primary",
  placeholder,
  onChange,
  value,
  style,
}: TextFieldPropsType) => (
  <S.Field
    disabled={disabled}
    type={type}
    fieldType={fieldType}
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    style={style}
  />
);

export default TextField;
