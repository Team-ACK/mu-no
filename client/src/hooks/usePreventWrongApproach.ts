import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import history from "../utils/history";

const usePreventWrongApproach = (nowUrl: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const listenBackEvent = () => {
      if (window.confirm("페이지를 벗어나면 진행상황이 사라집니다. 정말 페이지를 나가시겠습니까?")) {
        window.location.replace("/");
      } else {
        navigate(nowUrl);
      }
    };
    const historyEvent = history.listen(({ action }) => {
      if (action === "POP") {
        listenBackEvent();
      }
    });
    return historyEvent;
    // eslint-disable-next-line
  }, []);
};

export default usePreventWrongApproach;
