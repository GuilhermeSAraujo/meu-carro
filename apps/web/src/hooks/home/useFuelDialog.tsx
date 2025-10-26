"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FuelDialogContextType {
  isOpen: boolean;
  openDialog: (carId: string) => void;
  closeDialog: () => void;
  carId?: string;
}

const FuelDialogContext = createContext<FuelDialogContextType | undefined>(undefined);

export function FuelDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [carId, setCarId] = useState<string>();

  const openDialog = (id: string) => {
    setCarId(id);
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  return (
    <FuelDialogContext.Provider value={{ isOpen, openDialog, closeDialog, carId }}>
      {children}
    </FuelDialogContext.Provider>
  );
}

export function useFuelDialog() {
  const context = useContext(FuelDialogContext);
  if (!context) {
    throw new Error("useFuelDialog must be used within FuelDialogProvider");
  }
  return context;
}
