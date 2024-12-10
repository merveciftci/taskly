import {useDispatch, useSelector} from "react-redux";
import "./todayTask.css";
import moment from "moment";
import {useState} from "react";
import {addNewTask, completeTask} from "../../features/cart/tasksSlice";
import InboxModal from "../upcoming-Component/inboxModal";
import AddTask from "../AddTask/AddTask.jsx";

const todayDate = new Date();
const formattedDate = moment(todayDate).format("DDMMYYYY");

export const TodayTaskBar = () => {
    const tasks = useSelector((state) => state.tasks.items);
    const todayTasks = tasks[formattedDate];
    const [addingNewTask, setAddingNewTask] = useState(false);
    const [openInboxModal, setOpenInboxModal] = useState(null);

    const dispatch = useDispatch();

    const addNewTaskTodayTaskBar = () => {
        setAddingNewTask(true);
    };

    const handleCancelAddTask = () => {
        setAddingNewTask(false);
    };

    const getCount = () => {
        let counter = 0;
        if (todayTasks) {
            for (let i = 0; i < todayTasks.length; i++) {
                let task = todayTasks[i];
                if (!task.completed) {
                    counter++;
                }
            }
            return counter;
        } else {
            return counter;
        }
    };

    const handleSavingContent = (taskName, description) => {
        if (taskName || description !== "") {
            dispatch(addNewTask({date: formattedDate, taskName, description}));
        }

        setAddingNewTask(false);
    };

    const handleOpenInboxModal = (date, index) => {
        const formattedDate = moment(date).format("DDMMYYYY");
        const selectedTask = tasks[formattedDate]?.[index];
        setOpenInboxModal({
            selectedTask: {...selectedTask, date: formattedDate, index},
        });
    };

    //radio symbol task complete
    const handleConfirmTask = (index) => {
        dispatch(completeTask({date: formattedDate, index}));
        setOpenInboxModal(null);
    };

    if (getCount() === 0) {
        return (
            <div className="todayTaskBar-container">
                <h2 className="todayTask-Header">Today</h2>
                {addingNewTask ? (
                    <AddTask onSaveContent={handleSavingContent} onCancel={handleCancelAddTask}/>
                ) : (
                    <div>
                        <button
                            className="newTask-btn-wrapper"
                            onClick={addNewTaskTodayTaskBar}
                        >
                            <svg width="17" height="17" className="addNewNoteBtn-svg">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"
                                ></path>
                            </svg>
                            <span className="newTaskBtn-span">Add Task</span>
                        </button>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="https://todoist.b-cdn.net/assets/images/2d7e8bbda4f6d309a7719e0400ead068.png"
                                alt="listening"
                                style={{
                                    width: "250px",
                                    height: "250px",
                                }}
                            />
                            <h2 style={{fontWeight: "700", marginTop: "30px"}}>
                                What do you need to get done today?
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="todayTaskBar-container">
            <div className="todayTaskBar-wrapper">
                <div>
                    <h2 className="todayTask-Header">Today</h2>
                    <div className="todayTaskCounter-wrapper">
            <span className="todayTaskCounter">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="siIBvPn"
              >
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8 14.001a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5.146 8.147a.5.5 0 0 1 .708 0L7 9.294l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 0-.708Z"
                    clipRule="evenodd"
                ></path>
              </svg>
                {`${
                    getCount() === 1 ? getCount() + " task" : getCount() + " tasks"
                } `}
            </span>
                    </div>
                </div>
                <section className="todayTaskBar-section">
                    {todayTasks.map((task, taskIndex) => {
                        if (task.completed) return null;
                        return (
                            <button
                                key={taskIndex}
                                className="todayTaskBar-list_container"
                                onClick={() => handleOpenInboxModal(task, taskIndex)}
                            >
                                <div className="todayTaskBar-list_wrapper">
                  <span
                      className="todayTaskBar-btn"
                      onClick={(e) => {
                          handleConfirmTask(taskIndex);
                          e.stopPropagation();
                      }}
                  >
                    <svg
                        width="16px"
                        height="13px"
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
                                    <div className="todayTask-content">
                                        <div className="task_taskName"> {task.taskName}</div>
                                        <div className="task_description"> {task.description}</div>
                                    </div>
                                </div>
                                <hr
                                    style={{
                                        width: "800px",
                                        border: "0.1px solid #dbdbdb",
                                    }}
                                />
                            </button>
                        );
                    })}
                    {addingNewTask ? (
                        <AddTask onSaveContent={handleSavingContent} onCancel={handleCancelAddTask}/>
                    ) : (
                        <button
                            className="newTask-btn-wrapper"
                            onClick={addNewTaskTodayTaskBar}
                        >
                            <svg width="17" height="17" className="addNewNoteBtn-svg">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"
                                ></path>
                            </svg>
                            <span className="newTaskBtn-span">Add Task</span>
                        </button>
                    )}
                </section>

                {!!openInboxModal && (
                    <InboxModal
                        openInboxModal={openInboxModal}
                        setOpenInboxModal={setOpenInboxModal}
                    />
                )}
            </div>
        </div>
    );
};

export default TodayTaskBar;
