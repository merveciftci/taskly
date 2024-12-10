import {Calendar, message, Modal} from "antd";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addNewTask } from "../features/cart/tasksSlice";
import doneTasks from "../assests/checklist.png";
const todayDate = new Date();
const formattedDate = moment(todayDate).format("DDMMYYYY");
const overdueDate = moment().startOf("day");

const {useMessage} = message;

export const Sidebar = ({ mainbarMenu, onToggleMenu }) => {
  const userName = useSelector((state) => state.ui.userName);
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = useMessage();
  const getTaskCounts = () => {
    let todayCount = 0;
    let overdueCount = 0;

    for (const date in tasks) {
      const taskList = tasks[date];

      if (date === formattedDate) {
        todayCount = taskList.filter((task) => !task.completed).length;
      }

      if (moment(date, "DDMMYYYY").isBefore(overdueDate)) {
        overdueCount += taskList.filter((task) => !task.completed).length;
      }
    }
    return { todayCount, overdueCount };
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDueDateCalendar, setOpenDueDateCalendar] = useState(false);
  const { todayCount, overdueCount } = getTaskCounts();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = (value) => {
    const selectedDate = value.format("DDMMYYYY");
    setSelectedTask(selectedDate);
  };

  const handleUpdateDate = () => {
    setOpenDueDateCalendar(!openDueDateCalendar);
    if (selectedTask !== formattedDate) {
      console.log(selectedTask);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setTaskName("");
    setDescription("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTaskName("");
    setDescription("");
    setOpenDueDateCalendar(false);
  };

  // eski tarihler engellendi
  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const handleUpdateTaskName = (event) => {
    setTaskName(event.currentTarget.innerText);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSavingContent = async () => {
    if (taskName.length > 500) {
      await messageApi.error(
          `Maximum length of task length should be 500. Current length is ${taskName.length}.`,
          5
      );

      return;
    }

    if (taskName || description !== "") {
      dispatch(addNewTask({ date: selectedTask || formattedDate, taskName, description }));
      setDescription("");
      setTaskName("");
      document.querySelector(".newTodayTaskName").innerText = "";
      setIsModalOpen(false);
      setOpenDueDateCalendar(false);
      setSelectedTask(formattedDate);
    }
  };

  return (
    <nav className={`sidebar ${mainbarMenu ? "open" : "closed"}`}>
      {contextHolder}
      <div className="UserNavPanel">
        <h3 className="userName">{userName}</h3>
        <div className="IconBar">
          <button onClick={onToggleMenu} className="button menuIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="menuBar">
        <button className="button addTask-container" onClick={showModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="addTask-cont">Add Task</span>
        </button>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            footer={null}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div
              autoFocus
              className="newTodayTaskName"
              contentEditable
              onInput={handleUpdateTaskName}
              data-placeholder="Task Name"
            />
            <textarea
              name="Description"
              id="description"
              className="newTodayDescription"
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
            />
            <hr style={{ border: "0.1px solid #e1e1e1" }} />
            <footer className="cancelTodayTask-footer">
              <button className="dueDate-addTaskbtn" onClick={handleUpdateDate}>
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
              <button className="cancelTodayTask-Button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={`saveTodayTask-Button ${
                  taskName !== "" ? "disable" : ""
                }`}
                onClick={handleSavingContent}
              >
                Save
              </button>
            </footer>
            {openDueDateCalendar && (
              <Calendar
                mode="month"
                fullscreen={false}
                disabledDate={disabledDate}
                onChange={onChange}
              />
            )}
          </Modal>
        )}
        <Link to="/PastCompletedTasks">
          <button className="button taskNumber-btn menuItems">
            <img src={doneTasks} alt="done tasks" style={{ width: "25px" }} />
            <div className="notesInfo">
              <span className="span">Completed Tasks</span>
            </div>
          </button>
        </Link>
        <Link to="/OverTodayTaskBar">
          <button className="button menuItems">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
              />
            </svg>
            <div className="notesInfo">
              <span className="span">Overdue Tasks</span>
              <span className="span userNoteCounter">
                {overdueCount === 0 ? "" : overdueCount}
              </span>
            </div>
          </button>
        </Link>
        <Link to="/TodayTaskBar">
          <button className="button taskNumber-btn menuItems">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="notesInfo">
              <span className="span">Today</span>
              <span className="span userNoteCounter">
                {todayCount === 0 ? "" : todayCount}
              </span>
            </div>
          </button>
        </Link>
        <Link to="/UpcomingBar">
          <button className="button menuItems">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="span">Upcoming</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};
