import styled from "styled-components";

const S = {
  Field: styled.input`
    ${(props) => props.theme.typography.caption};
    margin: 7px;
    border: 1px solid rgb(0, 0, 0, 0.2);
    width: ${({ size }) => size};
    height: 46px;
    padding: 5px 10px;
    border-radius: 11px;
    :focus {
      outline: none;
      border: 1px solid #808088;
    }
    ::placeholder {
      color: #bdbdbd;
    }
  `,
};

const TextField: React.FC<any> = (props) => <S.Field {...props} />;

export default TextField;
