import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";
import { Home, Lobby } from "./pages";
import { socketStore } from "./store";

import { useEffect } from "react";

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
          <Route path="/:_/lobby" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
