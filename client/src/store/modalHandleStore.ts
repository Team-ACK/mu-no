import { create } from "zustand";

// Modal 추가시 타입 변경 요망
type ModalType = "SignUp" | "FindPassword" | "ResetPassword" | "HostDisconnected" | false;

interface ModalHandleStoreType {
  modal: ModalType;
  // Modal 설정
  setModal: (modal: ModalType) => void;
  // Modal 끄기
  removeModal: () => void;

  temporaryData: string;
  setTemporaryData: (data: string) => void;
}

const modalHandleStore = create<ModalHandleStoreType>((set) => ({
  modal: false,
  setModal: (modal) => {
    set((_) => ({ modal }));
  },
  removeModal: () => {
    set((_) => ({ modal: false }));
  },

  temporaryData: "",
  setTemporaryData: (data) => {
    set((_) => ({ temporaryData: data }));
  },
}));

export default modalHandleStore;
