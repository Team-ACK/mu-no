import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Button } from "../../../components";

const S = {
  DescriptionWrapper: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  Info: styled.h2`
    ${(props) => props.theme.typography.input};
    margin: 15px 0;
  `,
};

const Description = ({ children }: { children: JSX.Element }) => {
  const [render, setRender] = useState<boolean>(false);
  const renderDelay = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    renderDelay.current = setTimeout(() => {
      setRender(true);
    }, 700);
    return () => {
      clearTimeout(renderDelay.current as NodeJS.Timeout);
    };
  }, []);

  return (
    <S.DescriptionWrapper>
      <S.Info>{children}</S.Info>
      {render ? (
        <Button
          onClick={() => {
            window.location.replace("/");
          }}
          size="220px"
        >
          홈 화면으로 돌아가기
        </Button>
      ) : null}
    </S.DescriptionWrapper>
  );
};

export default Description;
