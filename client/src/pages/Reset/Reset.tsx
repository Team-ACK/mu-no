import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { modalHandleStore } from "../../store";

const Reset = () => {
  const { modal, setModal, setTemporaryData } = modalHandleStore();
  const { token } = useParams();

  // 첫 랜더링시 제외
  const didMount = useRef(0);
  useEffect(() => {
    if (didMount.current > 1) {
      if (modal === false) {
        window.location.replace("http://muno.fun");
      }
    } else didMount.current += 1;
  }, [modal]);

  useEffect(() => {
    if (token !== undefined) {
      setModal("ResetPassword");
      setTemporaryData(token);
    } else {
      window.location.replace("http://muno.fun");
    }
  }, []);

  return <div> </div>;
};

export default Reset;
