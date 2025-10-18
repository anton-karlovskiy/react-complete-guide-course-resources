import { createContext, useReducer } from 'react';

import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const ShoppingCartContext = createContext();

function shoppingCartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload
        );
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state, // not needed here because we have only one value
        items: updatedItems,
      };
    }

    case 'UPDATE_ITEM': {
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default function ShoppingCartProvider({ children }) {
  const [state, dispatch] = useReducer(shoppingCartReducer, { items: [] }
  );

  const value = {
    state,
    dispatch,
  };

  return (
    <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>
  );
}
