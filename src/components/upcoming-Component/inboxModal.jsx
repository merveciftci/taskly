import { Calendar, Modal } from "antd";
import "./Upcoming.css";
import { useEffect, useMemo, useState } from "react";
import InputContentEditable from "../InputContentEditable/InputContentEditable";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTask,
  updateInboxModal,
  pushOverdueTasks,
  deleteTask,
  updateTask,
} from "../../features/cart/tasksSlice";
import moment from "moment";

const InboxModal = ({ openInboxModal, setOpenInboxModal }) => {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openDueDateCalendar, setOpenDueDateCalendar] = useState(false);
  const [inboxEditTaskName, setInboxEditTaskName] = useState(false);
  const inboxModalInfo = useSelector((state) => state.tasks.inboxModal);

  const todayDate = new Date();

  const closeInboxModal = () => {
    setOpenInboxModal(null);
    setOpenDueDateCalendar(false);
    setInboxEditTaskName(false);
  };

  const handleRadioBtn = () => {
    setIsDisabled(!isDisabled);
    setIsActive(!isActive);
    setInboxEditTaskName(false);

    dispatch(
      completeTask({
        date: openInboxModal.selectedTask.date,
        index: openInboxModal.selectedTask.index,
      })
    );

    closeInboxModal();
  };

  const {
    taskName,
    description,
    defaultTaskName,
    defaultDescription,
    canceled,
  } = inboxModalInfo;

  const hasTaskNameLimitExceeded = useMemo(() => {
    return taskName.length > 500;
  }, [taskName]);

  const handleInboxTaskName = (event) => {
    dispatch(updateInboxModal({ taskName: event.currentTarget.innerText }));
  };

  const handleInboxDescription = (event) => {
    dispatch(updateInboxModal({ description: event.currentTarget.innerText }));
  };

  const handleCancelButton = () => {
    setInboxEditTaskName(false);

    dispatch(updateInboxModal({ canceled: true }));
  };

  const handleFocus = () => {
    if (isActive) return;
    setInboxEditTaskName(true);

    dispatch(updateInboxModal({ canceled: false }));
  };

  const handleEditToday = () => {
    if (!openInboxModal) return;
    dispatch(
      pushOverdueTasks({
        oldDate: openInboxModal.selectedTask.date,
        newDate: moment(todayDate).format("DDMMYYYY"),
        index: openInboxModal.selectedTask.index,
      })
    );
    closeInboxModal();
  };

  const handleEditNoDate = () => {
    if (!openInboxModal) return;
    dispatch(
      deleteTask({
        date: openInboxModal.selectedTask.date,
        taskIndex: openInboxModal.selectedTask.index,
      })
    );
    closeInboxModal();
  };

  const handleEditTomorrow = () => {
    if (!openInboxModal) return;

    const currentTaskDate = moment(
      openInboxModal.selectedTask.date,
      "DDMMYYYY"
    ).toDate();

    const tomorrow = new Date(currentTaskDate);
    tomorrow.setDate(currentTaskDate.getDate() + 1);
    dispatch(
      pushOverdueTasks({
        oldDate: openInboxModal.selectedTask.date,
        newDate: moment(tomorrow).format("DDMMYYYY"),
        index: openInboxModal.selectedTask.index,
      })
    );
    closeInboxModal();
  };

  const handleUpdateDate = () => {
    setOpenDueDateCalendar(!openDueDateCalendar);
  };

  const handleSendGmail = () => {
    const subject = encodeURIComponent(taskName);
    const body = encodeURIComponent(description);

    const anchor = document.createElement("a");

    anchor.target = "_blank";

    anchor.href = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;

    anchor.click();
  };

  const onPanelChange = (value) => {
    console.log(value.format("YYYY-MM-DD"));
  };

  const handleDueDateSelected = (date) => {
    const appointedDay = date.format("DDMMYYYY");

    dispatch(
      pushOverdueTasks({
        oldDate: openInboxModal.selectedTask.date,
        newDate: appointedDay,
        index: openInboxModal.selectedTask.index,
      })
    );
    closeInboxModal();
  };

  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const handleSavebtn = () => {
    console.log(openInboxModal);

    const selectedTaskIndex = openInboxModal.selectedTask.index;
    const formattedDate = openInboxModal.selectedTask.date;

    dispatch(
      updateTask({
        taskName,
        description,
        date: formattedDate,
        index: selectedTaskIndex,
      })
    );

    setInboxEditTaskName(false);
  };

  useEffect(() => {
    if (!openInboxModal) return;

    const { taskName, description } = openInboxModal.selectedTask;

    dispatch(
      updateInboxModal({
        taskName,
        description,
        defaultTaskName: taskName,
        defaultDescription: description,
        canceled: false,
      })
    );
  }, [dispatch, openInboxModal]);

  if (!openInboxModal) return null;

  return (
    <Modal
      footer={null}
      className="inboxModal"
      width="max-content"
      closeIcon={false}
      open
      onCancel={closeInboxModal}
    >
      <div className="inboxModalContainer">
        <header className="inboxHeaderContainer">
          <div className="inboxHeaderWrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
              className="AyswQEh"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M5.509 2h4.982a2 2 0 0 1 1.923 1.45l1.509 5.28c.051.18.077.365.077.55V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.28a2 2 0 0 1 .077-.55l1.509-5.28A2 2 0 0 1 5.509 2Zm0 1a1 1 0 0 0-.962.726l-1.509 5.28A1 1 0 0 0 3 9.28V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.28a.997.997 0 0 0-.039-.274l-1.508-5.28A1 1 0 0 0 10.49 3H5.51Zm4.685 7a2.25 2.25 0 0 1-4.388 0H4.5a.5.5 0 1 1 0-1h1.75a.5.5 0 0 1 .5.5 1.25 1.25 0 0 0 2.5 0 .5.5 0 0 1 .5-.5h1.75a.5.5 0 0 1 0 1h-1.306Z"
                clipRule="evenodd"
              ></path>
            </svg>
            Inbox
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <button className="closeButton" onClick={closeInboxModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M5.146 5.146a.5.5 0 0 1 .708 0L12 11.293l6.146-6.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 0 .708L12.707 12l6.147 6.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.708 0L12 12.707l-6.146 6.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708L11.293 12 5.146 5.854a.5.5 0 0 1-.057-.638z"
                ></path>
              </svg>
            </button>
          </div>
        </header>
        <hr />
        <div className="mainInboxBoard">
          <div className="inboxTaskNameWrapper">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRadioBtn();
              }}
              className={`checkBtnCircle inboxModalRadio ${
                isActive ? "activetedRadio" : ""
              }`}
            >
              <svg
                width="48px"
                height="48px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="tb7nk6f"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.5056 9.00958C16.2128 8.71668 15.7379 8.71668 15.445 9.00958L10.6715 13.7831L8.72649 11.8381C8.43359 11.5452 7.95872 11.5452 7.66583 11.8381C7.37294 12.1309 7.37293 12.6058 7.66583 12.8987L10.1407 15.3736C10.297 15.5299 10.5051 15.6028 10.7097 15.5923C10.8889 15.5833 11.0655 15.5104 11.2023 15.3735L16.5056 10.0702C16.7985 9.77735 16.7985 9.30247 16.5056 9.00958Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="inboxTaskNameContainer">
              <button className="inboxTaskNameButton" disabled={isDisabled}>
                <div
                  className={classNames("inboxModal--inputContainer", {
                    "inboxModal--inputContainer__focus": !!inboxEditTaskName,
                  })}
                >
                  <InputContentEditable
                    placeholder="Task Name"
                    isTitle
                    onInput={handleInboxTaskName}
                    onFocus={handleFocus}
                    value={taskName}
                    defaultValue={defaultTaskName}
                    canceled={canceled}
                    lineThrough={isActive}
                    disabled={isActive}
                  />

                  <InputContentEditable
                    placeholder="Description"
                    onInput={handleInboxDescription}
                    onFocus={handleFocus}
                    value={description}
                    defaultValue={defaultDescription}
                    canceled={canceled}
                    disabled={isActive}
                  />
                  {hasTaskNameLimitExceeded && (
                    <ErrorMessage>
                      Task name character limit: {taskName.length} / 500
                    </ErrorMessage>
                  )}
                </div>
              </button>
              {!!inboxEditTaskName && (
                <div className="inboxSetButtons">
                  <button
                    className="inboxCancelButton"
                    onClick={handleCancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavebtn}
                    disabled={hasTaskNameLimitExceeded}
                    className="inboxSaveButton"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="inboxDueDateWrapper">
            <button
              className="dueDate-btn"
              disabled={isActive}
              onClick={handleEditToday}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="scheduler-suggestions-item-icon--today"
                aria-hidden="true"
                focusable="false"
              >
                <g fill="currentColor" fillRule="evenodd">
                  <path
                    fillRule="nonzero"
                    d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z"
                  ></path>
                  <text
                    fontFamily="-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                    fontSize="9"
                    transform="translate(4 2)"
                    fontWeight="500"
                  >
                    <tspan x="8" y="15" textAnchor="middle">
                      12
                    </tspan>
                  </text>
                </g>
              </svg>
              Today
            </button>
            <button
              className="dueDate-btn"
              disabled={isActive}
              onClick={handleEditTomorrow}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="scheduler-suggestions-item-icon--tomorrow"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="orange"
                  fillRule="evenodd"
                  d="M9.704 17.544a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.956-2.31a.5.5 0 0 0-.27-.653Zm5.931-14.32a.5.5 0 0 0-.653.27l-.957 2.31a.5.5 0 1 0 .924.383l.957-2.31a.5.5 0 0 0-.27-.653ZM9.704 6.457a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 1 1 .924-.383l.956 2.31a.5.5 0 0 1-.27.653Zm5.931 14.32a.5.5 0 0 1-.653-.27l-.957-2.31a.5.5 0 0 1 .924-.383l.957 2.31a.5.5 0 0 1-.27.653ZM7.5 12a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Zm8 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-9.314 2.95a.5.5 0 0 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm14.32-5.932a.5.5 0 1 0-.383-.924l-2.31.957a.5.5 0 0 0 .383.924l2.31-.957Zm-2.692 5.932a.5.5 0 1 1 .383-.924l2.31.957a.5.5 0 0 1-.384.924l-2.31-.957ZM3.494 9.018a.5.5 0 0 1 .382-.924l2.31.957a.5.5 0 1 1-.383.924l-2.31-.957Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Tomorrow</span>
            </button>
            <button
              className="dueDate-btn"
              disabled={isActive}
              onClick={handleEditNoDate}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 1a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm3.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                ></path>
              </svg>
              Delete Task
            </button>
            <button
              className="dueDate-btn"
              disabled={isActive}
              onClick={handleUpdateDate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="scheduler-suggestions-item-icon--weekend"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M16 6a3 3 0 0 1 3 3v1h.1c1 0 1.9 1 1.9 2v4c0 1-.8 2-1.9 2H18v.5a.5.5 0 0 1-1 0V18H7v.5a.5.5 0 0 1-1 0V18H5a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2V9a3 3 0 0 1 3-3h8zm3 5a1 1 0 0 0-1 .9V15H6v-3a1 1 0 0 0-2-.1V16c0 .5.4 1 .9 1H19a1 1 0 0 0 1-.9V12c0-.6-.4-1-1-1zm-3-4H8c-1 0-2 .8-2 1.9v1.4c.6.3 1 1 1 1.7v2h10v-2a2 2 0 0 1 1-1.7V9c0-1-.8-2-1.9-2H16z"
                ></path>
              </svg>
              Update Date
            </button>
            <button className="dueDate-btn" onClick={handleSendGmail}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                style={{ padding: "0 4px", fill: "#5a0000" }}
                width="24"
                height="24"
                viewBox="0 0 50 50"
              >
                <path d="M 43.753906 6.4023438 C 42.53621 6.3489969 41.294792 6.712898 40.271484 7.46875 L 37.525391 9.4960938 L 25 18.755859 L 12.591797 9.5839844 A 1.0001 1.0001 0 0 0 11.949219 9.3007812 L 12.199219 9.3007812 L 9.734375 7.4765625 C 8.7104042 6.7188363 7.4671493 6.3528895 6.2480469 6.40625 C 5.0289444 6.4596105 3.8349462 6.9314667 2.9082031 7.8457031 C 1.7309454 9.0063798 1 10.629831 1 12.410156 L 1 15.84375 A 1.0001 1.0001 0 0 0 1 16.138672 L 1 39.5 C 1 41.421188 2.5788117 43 4.5 43 L 12 43 A 1.0001 1.0001 0 0 0 13 42 L 13 25.373047 L 24.40625 33.804688 A 1.0001 1.0001 0 0 0 25.59375 33.804688 L 37 25.373047 L 37 42 A 1.0001 1.0001 0 0 0 38 43 L 45.5 43 C 47.421188 43 49 41.421188 49 39.5 L 49 16.119141 A 1.0001 1.0001 0 0 0 49 15.859375 L 49 12.410156 C 49 10.6517 48.290455 9.0357821 47.128906 7.8730469 C 47.095336 7.8394769 47.084086 7.83018 47.097656 7.84375 A 1.0001 1.0001 0 0 0 47.091797 7.8378906 C 46.165242 6.9256756 44.971603 6.4556905 43.753906 6.4023438 z M 43.644531 8.4003906 C 44.400835 8.4300436 45.134049 8.7168876 45.689453 9.2636719 C 45.708363 9.2823439 45.722171 9.2964424 45.712891 9.2871094 C 46.50934 10.084374 47 11.188613 47 12.410156 L 47 15.496094 L 39 21.408203 L 39 11 A 1.0001 1.0001 0 0 0 38.996094 10.898438 L 41.458984 9.078125 A 1.0001 1.0001 0 0 0 41.460938 9.078125 C 42.109578 8.598977 42.888228 8.3707375 43.644531 8.4003906 z M 6.3574219 8.40625 C 7.1145694 8.37661 7.8958927 8.6037105 8.5449219 9.0839844 L 11.003906 10.902344 A 1.0001 1.0001 0 0 0 11 11 L 11 21.408203 L 3 15.496094 L 3 12.410156 C 3 11.174482 3.5017577 10.068855 4.3125 9.2695312 C 4.8677569 8.7217677 5.6002743 8.4358895 6.3574219 8.40625 z M 37 12.371094 L 37 22.886719 L 25 31.755859 L 13 22.886719 L 13 12.373047 L 24.40625 20.804688 A 1.0001 1.0001 0 0 0 25.59375 20.804688 L 37 12.371094 z M 3 17.982422 L 11 23.896484 L 11 41 L 4.5 41 C 3.6591883 41 3 40.340812 3 39.5 L 3 17.982422 z M 47 17.982422 L 47 39.5 C 47 40.340812 46.340812 41 45.5 41 L 39 41 L 39 23.896484 L 47 17.982422 z"></path>
              </svg>
              Send Gmail
            </button>
            {openDueDateCalendar && (
              <Calendar
                mode="month"
                fullscreen={false}
                onSelect={handleDueDateSelected}
                disabledDate={disabledDate}
                onPanelChange={onPanelChange}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default InboxModal;
