import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useEffect } from "react";
import { GlobalStyle, theme } from "./styles";
import { Home, Lobby, Reaction } from "./pages";
import { socketStore } from "./store";

const App = () => {
  const { setSocket } = socketStore();

  useEffect(() => {
    setSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path=":paramRoomCode" element={<Home />} />
          </Route>
          <Route path=":_/lobby" element={<Lobby />} />
          <Route path=":_/reaction" element={<Reaction />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
