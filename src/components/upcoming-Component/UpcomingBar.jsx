import { useState } from "react";
import "./Upcoming.css";
import moment from "moment";
import { createItems } from "./editingSavedItems";
import { UpcomingHeader } from "./upcomingHeader";
import { Dropdown, Modal, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTask,
  completeTask,
  deleteTask,
} from "../../features/cart/tasksSlice";
import { OverdueSection } from "./upcomingOverdue-section";
import InboxModal from "./inboxModal";
import AddTask from "../AddTask/AddTask.jsx";

const UpcomingBar = () => {
  const [calendar, setCalendar] = useState(false);
  const [selectedMonthAndYear, setSelectedMonthAndYear] = useState("");
  const [dates, setDates] = useState([]);
  const [clickedBoxIndex, setClickedBoxIndex] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [openInboxModal, setOpenInboxModal] = useState(null);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);

  //delete text which saved one
  const handleDeleteBtn = (date, taskName, taskIndex) => {
    setDeletingTask({ date, taskName, taskIndex });
    setVisibleDropdownIndex(null);
  };

  //radio task onaylama ve silme
  const handleConfirmTask = (date, index) => {
    setOpenInboxModal(null);
    const dayOfDates = tasks[moment(date).format("DDMMYYYY")];
    const todayDate = moment(date).format("DDMMYYYY");
    if (dayOfDates) {
      dispatch(completeTask({ date: todayDate, index }));
    }
  };

  const openInboxContent = (date, index) => {
    const formattedDate = moment(date).format("DDMMYYYY");

    const selectedTask = tasks[formattedDate]?.[index];

    setOpenInboxModal({
      selectedTask: { ...selectedTask, date: formattedDate, index },
    });
  };

  const generateDates = (todayDate) => {
    const dateArray = [];
    const dayOfWeek = todayDate.getDay(); // 0 for Sunday, 6 for Saturday
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Days remaining until Sunday

    for (let i = 0; i <= daysToSunday; i++) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  };

  const formatDate = (date) => {
    const today = moment().startOf("day");
    const inputDate = moment(date).startOf("day");

    if (inputDate.isSame(today)) {
      return `${moment(date).format("D MMM")} ‧ Today`;
    } else {
      return moment(date).format("D MMM ‧ dddd");
    }
  };

  const handleNewTaskAddingBtn = (index) => {
    setClickedBoxIndex(index);
  };

  const handleCancelAddTask = () => {
    setClickedBoxIndex(null);
  };

  //delete task last step
  const handleConfirmDeleteModal = () => {
    const { date, taskIndex } = deletingTask;
    const todayDate = moment(date).format("DDMMYYYY");
    dispatch(deleteTask({ date: todayDate, taskIndex }));
    setDeletingTask(null);
  };
  //delete task cancel
  const handleCloseDeleteModal = () => {
    setDeletingTask(null);
  };

  //locale veriyi kaydet
  const handleSavingContent = (date, index, taskName, description) => {
    const formattedDate = moment(date).format("DDMMYYYY");

    dispatch(addNewTask({ date: formattedDate, taskName, description }));

    setClickedBoxIndex(index);
  };

  const getCount = (date) => {
    const totalTasks = tasks[moment(date).format("DDMMYYYY")];
    let counter = 0;
    if (totalTasks) {
      for (let i = 0; i < totalTasks.length; i++) {
        let task = totalTasks[i];

        if (!task.completed) {
          counter++;
        }
      }
      return counter;
    } else {
      return counter;
    }
  };

  return (
    <div className="upcoming__Wrapper">
      <UpcomingHeader
        calendar={calendar}
        setCalendar={setCalendar}
        selectedMonthAndYear={selectedMonthAndYear}
        setSelectedMonthAndYear={setSelectedMonthAndYear}
        setDates={setDates}
        generateDates={generateDates}
      />
      <div className="addNewTask-container">
        <OverdueSection
          handleCloseDeleteModal={handleCloseDeleteModal}
          setSelectedMonthAndYear={setSelectedMonthAndYear}
          setDates={setDates}
          generateDates={generateDates}
          setOpenInboxModal={setOpenInboxModal}
        />
        {dates.map((date, dayIndex) => {
          return (
            <div className="addNewTask-section" key={dayIndex}>
              <div className="header-info">
                {formatDate(date)}
                <span className="task-counter">{getCount(date)}</span>
              </div>
              <div className="task-list-container">
                <div
                  className={` ${
                    clickedBoxIndex === dayIndex ? "activatedHeight" : ""
                  } `}
                >
                  {tasks[moment(date).format("DDMMYYYY")]?.map(
                    (task, taskIndex) => {
                      if (task.completed) return null;
                      return (
                        <button
                          key={taskIndex}
                          className="addedtaskList-container task-container"
                          onClick={() => openInboxContent(date, taskIndex)}
                        >
                          <div className="addedtaskList-wrapper">
                            <div className="board_task_info">
                              <div className="addedTaskName_editBtn-container">
                                <div className="addedTaskName-wrapper">
                                  <span
                                    className="checkBtnCircle"
                                    onClick={(e) => {
                                      handleConfirmTask(date, taskIndex);
                                      e.stopPropagation();
                                    }}
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
                                      ></path>
                                    </svg>
                                  </span>
                                  <div className="addedTaskName">
                                    {task.taskName}
                                  </div>
                                </div>
                                <span className="editBtn-symbol">
                                  <Dropdown
                                    menu={{
                                      items: createItems(taskIndex, () =>
                                        handleDeleteBtn(
                                          date,
                                          task.taskName,
                                          taskIndex
                                        )
                                      ),
                                    }}
                                    onOpenChange={(open) => {
                                      setVisibleDropdownIndex(
                                        open ? `${dayIndex}${taskIndex}` : null
                                      );
                                    }}
                                    trigger={["click"]}
                                    open={
                                      visibleDropdownIndex ===
                                      `${dayIndex}${taskIndex}`
                                    }
                                  >
                                    <a onClick={(e) => e.stopPropagation()}>
                                      <Space>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                        >
                                          <g
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            transform="translate(3 10)"
                                          >
                                            <circle
                                              cx="2"
                                              cy="2"
                                              r="2"
                                            ></circle>
                                            <circle
                                              cx="9"
                                              cy="2"
                                              r="2"
                                            ></circle>
                                            <circle
                                              cx="16"
                                              cy="2"
                                              r="2"
                                            ></circle>
                                          </g>
                                        </svg>
                                      </Space>
                                    </a>
                                  </Dropdown>
                                </span>
                              </div>
                              <p className="addedDescription">
                                {task.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
              {clickedBoxIndex !== dayIndex && (
                <button
                  className="newTask-btn-wrapper"
                  onClick={() => handleNewTaskAddingBtn(dayIndex)}
                >
                  <svg width="17" height="17" className="addNewNoteBtn-svg">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"
                    ></path>
                  </svg>{" "}
                  <span className="newTaskBtn-span">Add Task</span>
                </button>
              )}
              {clickedBoxIndex === dayIndex && (
                <AddTask
                  onSaveContent={(taskName, description) => {
                    handleSavingContent(date, dayIndex, taskName, description);
                  }}
                  onCancel={handleCancelAddTask}
                />
              )}
            </div>
          );
        })}
      </div>
      {!!openInboxModal && (
        <InboxModal
          openInboxModal={openInboxModal}
          setOpenInboxModal={setOpenInboxModal}
        />
      )}
      <Modal
        open={!!deletingTask}
        onOk={handleConfirmDeleteModal}
        onCancel={handleCloseDeleteModal}
      >
        <div>
          <span
            style={{
              display: "flex",
              maxWidth: "472px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "400",
            }}
          >
            The{" "}
            <h4
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "600",
                padding: "0 4px",
              }}
            >
              {deletingTask?.taskName}
            </h4>
            task will be permanently deleted.
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default UpcomingBar;
