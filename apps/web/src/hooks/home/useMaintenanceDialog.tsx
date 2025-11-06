"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MaintenanceDialogContextType {
  isOpen: boolean;
  openDialog: (carId: string) => void;
  closeDialog: () => void;
  carId?: string;
}

const MaintenanceDialogContext = createContext<MaintenanceDialogContextType | undefined>(undefined);

export function MaintenanceDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [carId, setCarId] = useState<string>();

  const openDialog = (id: string) => {
    setCarId(id);
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  return (
    <MaintenanceDialogContext.Provider value={{ isOpen, openDialog, closeDialog, carId }}>
      {children}
    </MaintenanceDialogContext.Provider>
  );
}

export function useMaintenanceDialog() {
  const context = useContext(MaintenanceDialogContext);
  if (!context) {
    throw new Error("useMaintenanceDialog must be used within MaintenanceDialogProvider");
  }
  return context;
}
