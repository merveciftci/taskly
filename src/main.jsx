import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store.js";
import { ConfigProvider } from "antd";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#694a72",
        },
      }}
    >
      <StrictMode>
        <App />
      </StrictMode>
    </ConfigProvider>
  </Provider>
);
