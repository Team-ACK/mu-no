import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="App">
        <h1>안녕하세요</h1>
      </div>
    </ThemeProvider>
  );
};
export default App;
