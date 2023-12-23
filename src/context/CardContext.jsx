import { createContext, useReducer, useContext } from "react";
import { initialState, cardReducer } from "./CardReducer";
import PropTypes from "prop-types";

const CardContext = createContext();

const CardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, initialState);

  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

// Add prop validation for the children prop
CardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CardProvider, useCardContext };
