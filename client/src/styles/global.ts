import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};
  *, *::before, *::after {
    box-sizing: border-box;
	font-family: 'Noto Sans KR', sans-serif;
  };
  p {
    line-height: 1.5;
  }
  
`;

export default GlobalStyle;
