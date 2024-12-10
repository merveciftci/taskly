import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Dropdown, Space, Modal } from "antd";
import {
  completeTask,
  deleteTask,
  pushOverdueTasks,
} from "../../features/cart/tasksSlice";
import { createItems } from "./editingSavedItems";
import { Calendar, theme } from "antd";

export const OverdueSection = ({
  setSelectedMonthAndYear,
  setDates,
  generateDates,
  setOpenInboxModal,
}) => {
  const tasks = useSelector((state) => state.tasks.items);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [deletingTask, setDeletingTask] = useState(null);
  const [openRescheduleCalendarModal, setOpenRescheduleCalendarModal] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const dispatch = useDispatch();
  const { token } = theme.useToken();

  useEffect(() => {
    const overdue = [];
    const today = moment().startOf("day");

    Object.keys(tasks).forEach((date) => {
      tasks[date].forEach((task, index) => {
        const taskDate = moment(date, "DDMMYYYY").startOf("day");
        if (taskDate.isBefore(today) && !task.completed) {
          overdue.push({
            ...task,
            date,
            index,
          });
        }
      });
    });

    setOverdueTasks(overdue);
  }, [tasks]);

  const overdueCount = overdueTasks.length;

  const todayDate = new Date();
  const formattedDate = moment(todayDate, "DDMMYYYY").startOf("day");
  const sortedTasks = [...overdueTasks].sort((a, b) => {
    return b.index - a.index;
  });

  const handleEditToday = () => {
    sortedTasks.forEach((task) => {
      if (formattedDate.isBefore(todayDate) && !task.completed) {
        dispatch(
          pushOverdueTasks({
            oldDate: task.date,
            newDate: moment(todayDate).format("DDMMYYYY"),
            index: task.index,
          })
        );
      }
    });
  };

  const handleEditTomorrow = () => {
    let tomorrow = new Date(todayDate);
    tomorrow.setDate(todayDate.getDate() + 1);
    sortedTasks.forEach((task) => {
      if (formattedDate.isBefore(todayDate) && !task.completed) {
        dispatch(
          pushOverdueTasks({
            oldDate: task.date,
            newDate: moment(tomorrow).format("DDMMYYYY"),
            index: task.index,
          })
        );
      }
    });
  };

  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const handleEditNoDate = () => {
    const sortedTasks = [...overdueTasks].sort((a, b) => {
      return b.index - a.index;
    });

    sortedTasks.forEach((task) => {
      dispatch(deleteTask({ date: task.date, taskIndex: task.index }));
    });
  };

  const handleUpdateDate = () => {
    setOpenRescheduleCalendarModal(true);
  };

  const items = [
    {
      label: (
        <button className="reschedule-btn" onClick={handleEditToday}>
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
      ),
      key: "0",
    },
    {
      label: (
        <button className="reschedule-btn" onClick={handleEditTomorrow}>
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
      ),
      key: "1",
    },
    {
      label: (
        <button className="reschedule-btn" onClick={handleUpdateDate}>
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
      ),
      key: "2",
    },
    {
      label: (
        <button className="reschedule-btn" onClick={handleEditNoDate}>
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
          No Date
        </button>
      ),
      key: "3",
    },
  ];

  const handleConfirmTask = (date, index) => {
    const dayOfDates = tasks[date];
    if (dayOfDates) {
      dispatch(completeTask({ date, index }));
    }
  };

  const handleDeleteBtn = (date, taskName, index) => {
    setDeletingTask({ date, index, taskName });
    setVisibleDropdownIndex(null);
  };

  //delete task last step
  const handleConfirmDeleteModal = () => {
    const { date, index } = deletingTask;
    dispatch(deleteTask({ date, taskIndex: index }));
    setDeletingTask(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingTask(null);
  };

  const handleDate = (value, selectInfo) => {
    if (selectInfo.source !== "date") return;

    const dateString = value.format("YYYY-MM-DD");
    setSelectedDate(dateString);

    // date on js format
    const javascriptFormatDate = moment(dateString).toDate();

    // takvimden seçilen ay ve yıl
    const formattedDate = moment(dateString).format("MMMM YYYY");
    setSelectedMonthAndYear(formattedDate);
    setDates(generateDates(javascriptFormatDate, 7));
    setOpenRescheduleCalendarModal(true);
  };

  const handleConfirmRescheduleModal = () => {
    sortedTasks.forEach((task) => {
      if (selectedDate && !task.completed) {
        dispatch(
          pushOverdueTasks({
            oldDate: task.date,
            newDate: moment(selectedDate).format("DDMMYYYY"),
            index: task.index,
          })
        );
      }
    });
    setOpenRescheduleCalendarModal(false);
  };

  const handleCancelRescheduleModal = () => {
    setOpenRescheduleCalendarModal(false);
  };

  const openInboxContent = (index) => {
    const selectedTask = overdueTasks[index];

    setOpenInboxModal({
      selectedTask: { ...selectedTask },
    });
  };

  return (
    <div
      className={`overdue-board-section ${
        overdueTasks.length == 0 && "overdueNone"
      }`}
    >
      <div className="overdue-header">
        <span className="overdue-content">
          Overdue
          <span>{overdueCount}</span>
        </span>
        <button className="overdue-button">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>Reschedule</a>
          </Dropdown>
        </button>
      </div>
      {overdueTasks.length > 0 && (
        <ul>
          {overdueTasks.map((task, index) => {
            const date = task.date;
            const formattedDate = moment(date, "DDMMYYYY").format("D MMM");
            const isYesterday = moment(date, "DDMMYYYY").isSame(
              moment().subtract(1, "days"),
              "day"
            );
            return (
              <button
                key={index}
                className="overdue-section addedtaskList-container task-container"
                onClick={() => openInboxContent(index)}
              >
                <div className="addedtaskList-wrapper">
                  <div className="board_task_info">
                    <div className="addedTaskName_editBtn-container">
                      <div className="addedTaskName-wrapper">
                        <span
                          className="checkBtnCircle"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmTask(task.date, task.index);
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
                            />
                          </svg>
                        </span>
                        <div className="addedTaskName">{task.taskName}</div>
                      </div>
                      <span className="editBtn-symbol">
                        <Dropdown
                          menu={{
                            items: createItems(index, () =>
                              handleDeleteBtn(
                                task.date,
                                task.taskName,
                                task.index
                              )
                            ),
                          }}
                          onOpenChange={(open) => {
                            setVisibleDropdownIndex(open ? index : null);
                          }}
                          trigger={["click"]}
                          open={visibleDropdownIndex === index}
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
                                  <circle cx="2" cy="2" r="2"></circle>
                                  <circle cx="9" cy="2" r="2"></circle>
                                  <circle cx="16" cy="2" r="2"></circle>
                                </g>
                              </svg>
                            </Space>
                          </a>
                        </Dropdown>
                      </span>
                    </div>
                    <p className="addedDescription">{task.description}</p>
                    <p className="addedTaskDate">
                      {isYesterday ? "Yesterday" : formattedDate}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </ul>
      )}
      <Modal
        open={!!deletingTask}
        onOk={handleConfirmDeleteModal}
        onCancel={handleCloseDeleteModal}
      >
        <div>
          <h3 className="cancelDicardHeader">Delete task?</h3>
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
      <Modal
        open={openRescheduleCalendarModal}
        onOk={handleConfirmRescheduleModal}
        onCancel={handleCancelRescheduleModal}
      >
        <div style={wrapperStyle}>
          <Calendar onSelect={handleDate} mode="month" fullscreen={false} />
        </div>
      </Modal>
    </div>
  );
};

export default OverdueSection;
