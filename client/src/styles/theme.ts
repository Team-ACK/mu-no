import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  palette: {
    white: "#ffffff",
    black: "#393a43",
    lightgray: "#fafafa",
    shadowColor: "rgba(0, 0, 0, 0.11)",
    borderColor: "#e2e2e254",
  },

  typography: {
    caption: {
      fontFamily: '"Noto Sans KR", sans-serif',
      fontSize: "0.875rem",
    },
    button: {
      fontFamily: '"Noto Sans KR", sans-serif',
      fontSize: "20px",
    },
    reactionButton: {
      fontFamily: '"Noto Sans KR", sans-serif',
      fontSize: "32px",
    },
    input: {
      fontFamily: '"Noto Sans KR", sans-serif',
      fontSize: "27px",
    },
    information: {
      fontFamily: '"Noto Sans KR", sans-serif',
      fontSize: "24px",
    },
  },
};

export default theme;
