import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCardContext } from "../../context/CardContext";
import config from "../../config.json";
import axios from "axios";
import "./cardComponent.css";

const CardComponent = () => {
  const { state, dispatch } = useCardContext();
  const { showAddToCard, quantity, selectedCardId } = state;

  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const response = await axios.get(`${config.apiUrl}/products`);
      setItems(response.data);
    }
    fetchItems();
  }, []);

  const handleAddToCard = (itemId) => {
    const selectedItem = items.find((item) => item._id === itemId);

    dispatch({ type: "ADD_TO_CARD", payload: selectedItem });
    dispatch({ type: "SHOW_ADD_TO_CARD", payload: true });
    dispatch({ type: "SET_VERTICAL_BORDER", payload: true });
    dispatch({ type: "SET_SELECTED_CARD", payload: itemId });
    dispatch({ type: "SET_QUANTITY", payload: quantity + 1 });
  };

  const handleDelete = (itemId) => {
    if (quantity > 1) {
      dispatch({ type: "SET_QUANTITY", payload: quantity - 1 });
    } else {
      dispatch({ type: "REMOVE_FROM_CARD", payload: itemId });
      dispatch({ type: "SHOW_ADD_TO_CARD", payload: false });
      dispatch({ type: "SET_QUANTITY", payload: 0 });
      dispatch({ type: "SET_VERTICAL_BORDER", payload: false });
      dispatch({ type: "SET_SELECTED_CARD", payload: null });
    }
  };

  const buttonStyle = (itemId) => ({
    position: "absolute",
    bottom: "13px",
    right: selectedCardId === itemId ? "-15.3rem" : "-13rem",
    zIndex: "1000",
    cursor: "pointer",
    borderRadius: "500px",
    border: "2px solid #3498db",
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#d0c4ff",
    height: "40px",
    width: selectedCardId === itemId ? "110px" : "40px",
    transitionProperty:
      "background-color, border-color, color, box-shadow, filter, width, right",
    transitionDuration: ".3s",
  });

  const iconCommonStyle = {
    color: "#3498db",
    cursor: "pointer",
  };

  const cardStyles = (itemId) => ({
    borderLeft:
      selectedCardId === itemId ? "6px solid #6741FF" : "1px solid #d9dce2",
  });

  return (
    <div className="container mt-5">
      <div className="row">
        {items?.map((item) => (
          <div key={item._id} className="col-12 col-md-6 mb-4">
            <div className="card custom-card" style={cardStyles(item._id)}>
              <div className="row no-gutters">
                <div className="col-12 col-md-6 center-image">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">Price: ₦{item.defaultPrice}</p>
                  </div>
                  <div style={buttonStyle(item._id)}>
                    {showAddToCard && selectedCardId === item._id ? (
                      <div className="d-flex align-items-center justify-content-around">
                        <FontAwesomeIcon
                          style={{ ...iconCommonStyle, marginTop: "0.6rem" }}
                          className="trash-icon"
                          icon={faTrash}
                          onClick={() => handleDelete(item._id)}
                        />
                        <span className="quantity-indicator">{quantity}</span>
                        <FontAwesomeIcon
                          style={{ ...iconCommonStyle, marginTop: "0.6rem" }}
                          className="plus-icon"
                          icon={faPlus}
                          onClick={() => handleAddToCard(item._id)}
                        />
                      </div>
                    ) : (
                      <FontAwesomeIcon
                        style={{ ...iconCommonStyle, marginTop: "0.6rem" }}
                        className="plus-icon "
                        icon={faPlus}
                        onClick={() => handleAddToCard(item._id)}
                      />
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6 center-image">
                  <img
                    src={item.productImage}
                    className="img-fluid mr-3"
                    alt="Product Image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
