import { useDispatch, useSelector } from "react-redux";
import {Input, Modal} from "antd";
import { uiActions } from "../features/cart/uiSlice";
import { useState } from "react";
export const UserNameModal = () => {
  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.ui.isLoggedIn);

  const handleClose = () => {
    dispatch(uiActions.toggleLoggedIn());
  };

  const handleName = (event) => {
    const value = event.target.value;
    setUserName(value);
  };
  const handleConfirm = () => {
    dispatch(uiActions.updateUserName(userName));
    dispatch(uiActions.toggleLoggedIn());
  };
  return (
    <Modal
      open={!isLoggedIn}
      centered
      onOk={handleConfirm}
      onCancel={handleClose}
    >
      <h3 className="namingModal">Welcome! What is your name?</h3>
      <Input
        className="nameInput"
        value={userName}
        type="text"
        onChange={handleName}
      />
    </Modal>
  );
};
