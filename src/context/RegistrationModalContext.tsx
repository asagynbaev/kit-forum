import { createContext, useContext, useState } from "react";

interface Ctx {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const RegistrationModalContext = createContext<Ctx>({
  open: false,
  openModal: () => {},
  closeModal: () => {},
});

export function RegistrationModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <RegistrationModalContext.Provider
      value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}
    >
      {children}
    </RegistrationModalContext.Provider>
  );
}

export function useRegistrationModal() {
  return useContext(RegistrationModalContext);
}
