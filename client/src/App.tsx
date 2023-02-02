import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";
import { Home, Lobby } from "./pages";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/lobby" element={<Lobby/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
