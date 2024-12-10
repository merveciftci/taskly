import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./features/cart/cartSlice";
import UiReducer from "./features/cart/uiSlice";
import TasksReducer from "./features/cart/tasksSlice";
export const store = configureStore({
  reducer: {
    cart: CartReducer,
    ui: UiReducer,
    tasks: TasksReducer,
  },
});
