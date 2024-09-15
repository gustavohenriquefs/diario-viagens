import { createContext } from "react";
import { toast } from "react-toastify";

export const travelDiaryToast = () => {
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    toast[type](message, { 
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }

  return { showToast };
}

interface TravelDiaryToastContextProps {
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void;
}

const TravelDiaryToastContext = createContext<TravelDiaryToastContextProps>({ showToast: () => {} });

export const TravelDiaryToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TravelDiaryToastContext.Provider value={travelDiaryToast()}>
      {children}
    </TravelDiaryToastContext.Provider>
  );
};