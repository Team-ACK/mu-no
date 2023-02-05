import io from "socket.io-client"; // Client Socket
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";
import { Home, Lobby } from "./pages";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const socket: any = io("http://54.250.12.96");

    socket.emit("clientEmit", () => {});
    socket.on("welcome", (res: any) => {
      console.log(res);
    });
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
