import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { modalHandleStore } from "../../store";
import { HOST_URL } from "../../utils/envProvider";

const Reset = () => {
  const { setModal, setTemporaryData } = modalHandleStore();
  const { token } = useParams();

  useEffect(() => {
    if (token !== undefined) {
      setModal("ResetPassword");
      setTemporaryData(token);
    } else {
      window.location.replace(HOST_URL);
    }
    // eslint-disable-next-line
  }, []);

  return <div> </div>;
};

export default Reset;
