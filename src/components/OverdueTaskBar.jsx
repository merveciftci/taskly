import {useDispatch, useSelector} from "react-redux";
import "./todayTaskBar-component/todayTask.css";
import moment from "moment";
import {completeTask} from "../features/cart/tasksSlice";
import reading from "../assests/readingBook.png";
import InboxModal from "./upcoming-Component/inboxModal";
import {useState} from "react";

const todayDate = moment().startOf("day");

const OverTodayTaskBar = () => {
    const tasks = useSelector((state) => state.tasks.items);
    const [openInboxModal, setOpenInboxModal] = useState(null);

    const dispatch = useDispatch();

    const overdueTasks = Object.keys(tasks)
        .filter((date) =>
            moment(date, "DDMMYYYY").startOf("day").isBefore(todayDate)
        )
        .map((date) =>
            tasks[date].map((task, index) => ({
                ...task,
                date,
                index,
            }))
        )
        .flat();

    const getCount = () => {
        return overdueTasks.filter((task) => !task.completed).length;
    };

    //radio symbol task complete
    const handleConfirmTask = (task) => {
        dispatch(completeTask({date: task.date, index: task.index}));
        setOpenInboxModal(null);
    };

    const handleOpenInboxModal = (index) => {
        const selectedTask = overdueTasks[index];

        setOpenInboxModal({
            selectedTask: {
                ...selectedTask,
                index: selectedTask.index,
            },
        });
    };

    if (getCount() === 0) {
        return (
            <div className="todayTaskBar-container">
                <h2 className="todayTask-Header">Overdue Tasks</h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={reading}
                        alt="listening"
                        style={{
                            width: "250px",
                            height: "250px",
                        }}
                    />
                    <h2 style={{marginTop: "30px"}}>
                        No tasks match the current sorting options.
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="todayTaskBar-container">
            <div className="todayTaskBar-wrapper">
                <div>
                    <h2 className="todayTask-Header">Overdue Tasks</h2>
                </div>
                <section className="todayTaskBar-section">
                    {overdueTasks.map((task, taskIndex) => {
                        if (task.completed) return null;
                        return (
                            <button
                                key={taskIndex}
                                className="todayTaskBar-list_container"
                                onClick={() => handleOpenInboxModal(taskIndex)}
                            >
                                <div className="todayTaskBar-list_wrapper">
                  <span
                      className="todayTaskBar-btn"
                      onClick={(e) => {
                          handleConfirmTask(task);
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
                                        <br/>
                                        <div className="task_description">
                                            {moment(task.date, "DDMMYYYY").format("D MMM")}
                                        </div>
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
                </section>
            </div>
            {!!openInboxModal && (
                <InboxModal
                    setOpenInboxModal={setOpenInboxModal}
                    openInboxModal={openInboxModal}
                />
            )}
        </div>
    );
};

export default OverTodayTaskBar;
