import styled from "styled-components";

interface Props {
  type: string;
  placeholder: string;
}

const S = {
  Field: styled.input`
    ${(props) => props.theme.typography.caption};
    border: 1px solid ${(props) => props.theme.palette.lightgray};
    width: fit-content;
    padding: 1rem;
    border-radius: 0.5rem;
    :focus {
      outline: none;
      border: 1px solid ${(props) => props.theme.palette.black};
    }
    ::placeholder {
      color: ${(props) => props.theme.palette.gray};
    }
  `,
};

const TextField: React.FC<Props> = (props) => <S.Field {...props} />;

export default TextField;
