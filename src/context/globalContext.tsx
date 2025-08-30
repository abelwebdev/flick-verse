import React, { useCallback, useContext, useState } from "react";

const context = React.createContext({

  closeModal: () => { },
  isModalOpen: false,
  showSidebar: false,
  setShowSidebar: (prevValue: boolean) => { },
  setIsModalOpen: (value: boolean) => { }
});

interface Props {
  children: React.ReactNode;
}

const GlobalContextProvider = ({ children }: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = useCallback(() => {
    if (!isModalOpen) return;
    setIsModalOpen(false);
  }, [isModalOpen]);


  return (
    <context.Provider
      value={{
        closeModal,
        isModalOpen,
        showSidebar,
        setShowSidebar,
        setIsModalOpen
      }}
    >
      {children}
    </context.Provider>
  );
};

export default GlobalContextProvider;

export const useGlobalContext = () => {
  return useContext(context);
};
