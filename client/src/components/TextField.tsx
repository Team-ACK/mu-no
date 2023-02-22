import styled from "styled-components";

const S = {
  Field: styled.input`
    ${(props) => props.theme.typography.caption};
    border: ${(props: any) => (props.red ? "1.5px solid #ff3d3d" : "1px solid rgb(0, 0, 0, 0.2)")};
    border-radius: 11px;
    width: ${({ size }) => size};
    height: 46px;
    margin: 7px;
    padding: 5px 10px;
    :focus {
      outline: none;
      border: ${(props: any) => (props.red ? "1.5px solid #ff3333" : "1px solid #808088")};
    }
    ::placeholder {
      color: #bdbdbd;
    }
  `,
};

const TextField: React.FC<any> = (props) => <S.Field {...props} />;

export default TextField;
