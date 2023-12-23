export const initialState = {
  showAddToCard: false,
  quantity: 0,
  hasVerticalBorder: false,
  selectedCardId: null,
};

export const cardReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_ADD_TO_CARD":
      return { ...state, showAddToCard: action.payload };
    case "SET_QUANTITY":
      return { ...state, quantity: action.payload };
    case "SET_VERTICAL_BORDER":
      return {
        ...state,
        hasVerticalBorder: action.payload,
      };
    case "SET_SELECTED_CARD":
      return {
        ...state,
        selectedCardId: action.payload,
      };
    default:
      return state;
  }
};
