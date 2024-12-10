import { useSelector } from "react-redux";
import "./todayTask.css";
import moment from "moment";
import checkedTasks from "../../assests/check.png";

export const PastCompletedTasks = () => {
  const tasks = useSelector((state) => state.tasks.items);

  const completedTasks = Object.entries(tasks).flatMap(([date, taskList]) =>
    taskList.filter((task) => task.completed).map((task) => ({ ...task, date }))
  );

  if (!completedTasks.length) {
    return (
      <div className="todayTaskBar-container">
        <h2 className="todayTask-Header" style={{ paddingBottom: "100px" }}>
          Completed Tasks
        </h2>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://todoist.b-cdn.net/assets/images/1a2881d76cef24248553ce929cb4d431.png"
              alt="picture"
              style={{
                width: "250px",
                height: "250px",
              }}
            />
            <h2 style={{  marginTop: "30px" }}>
              No tasks match the current sorting options.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="todayTaskBar-container">
      <div className="todayTaskBar-wrapper">
        <div>
          <h2 className="todayTask-Header">Completed Tasks</h2>
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
                completedTasks.length === 1
                  ? completedTasks.length + " task completed"
                  : completedTasks.length + " tasks completed"
              } `}
            </span>
          </div>
        </div>
        <section className="todayTaskBar-section">
          {completedTasks.map((task, taskIndex) => (
            <button key={taskIndex} className="todayTaskBar-list_container">
              <div className="todayTaskBar-list_wrapper">
                <span>
                  <img src={checkedTasks} alt="checked tasks" />
                </span>
                <div className="todayTask-content">
                  <div className="task_taskName"> {task.taskName}</div>
                  <div className="task_description"> {task.description}</div>
                  <br />
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
          ))}
        </section>
      </div>
    </div>
  );
};

export default PastCompletedTasks;
