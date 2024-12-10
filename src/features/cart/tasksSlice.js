import { createSlice } from "@reduxjs/toolkit";

const loadStateFromLocalStorage = () => {
  const serializedState = localStorage.getItem("items");
  return serializedState ? JSON.parse(serializedState) : {};
};

const DEFAULT_INBOX_MODAL = {
  taskName: "",
  description: "",
  defaultDescription: "",
  defaultTaskName: "",
  canceled: false,
};

const initialState = {
  items: loadStateFromLocalStorage(),
  inboxModal: { ...DEFAULT_INBOX_MODAL },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addNewTask: (state, action) => {
      const { taskName, description, date } = action.payload;
      if (state.items[date]) {
        state.items[date].push({
          taskName,
          description,
          completed: false,
        });
      } else {
        state.items[date] = [
          {
            taskName,
            description,
            completed: false,
          },
        ];
      }
      localStorage.setItem("items", JSON.stringify(state.items));
    },
    completeTask: (state, action) => {
      const { date, index } = action.payload;
      state.items[date][index].completed = true;
      localStorage.setItem("items", JSON.stringify(state.items));
    },
    deleteTask: (state, action) => {
      const { date, taskIndex } = action.payload;
      if (state.items[date]) {
        const filteredItems = state.items[date].filter(
          (_, index) => index !== taskIndex
        );
        state.items[date] = filteredItems;
        localStorage.setItem("items", JSON.stringify(state.items));
      }
    },
    updateInboxModal: (state, action) => {
      const {
        taskName,
        description,
        defaultDescription,
        defaultTaskName,
        canceled,
      } = action.payload;

      if (defaultTaskName) {
        state.inboxModal.defaultTaskName = defaultTaskName;
      }

      if (defaultDescription) {
        state.inboxModal.defaultDescription = defaultDescription;
      }

      if (taskName) {
        state.inboxModal.taskName = taskName;
      }

      if (description) {
        state.inboxModal.description = description;
      }

      if (canceled !== undefined) {
        state.inboxModal.canceled = canceled;
      }
    },
    pushOverdueTasks: (state, action) => {
      const { oldDate, newDate, index } = action.payload;
      const oldTask = state.items[oldDate][index];
      if (!oldTask) return;
      if (state.items[newDate]) {
        state.items[newDate].push(oldTask);
      } else {
        state.items[newDate] = [oldTask];
      }
      state.items[oldDate].splice(index, 1);
      localStorage.setItem("items", JSON.stringify(state.items));
    },
    updateTask: (state, action) => {
      const { taskName, description, date, index } = action.payload;
      const task = state.items[date][index];
      if (task) {
        task.taskName = taskName;
        task.description = description;
      }
      localStorage.setItem("items", JSON.stringify(state.items));
    },
  },
});

export const {
  addNewTask,
  deleteTask,
  completeTask,
  pushOverdueTasks,
  updateInboxModal,
  updateTask,
} = tasksSlice.actions;
export default tasksSlice.reducer;

// {
//   "2020202": [{taskName: "sadasd", description: "asfmkasdmflkmsad", completed: false}]
// }
