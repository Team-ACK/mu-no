import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { modalHandleStore } from "../../store";

const Reset = () => {
  const { modal, setModal, setTemporaryData } = modalHandleStore();
  const { token } = useParams();

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
