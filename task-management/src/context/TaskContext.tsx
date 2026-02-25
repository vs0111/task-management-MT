import { createContext, useReducer, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import useLocalStorage from "../hooks/useLocalStorage";

interface State {
  tasks: Task[];
  users: User[];
  loadingUsers: boolean;
  usersError: string;
}

type Action =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const TaskContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case "SET_USERS":
      return { ...state, users: action.payload };

    case "SET_LOADING":
      return { ...state, loadingUsers: action.payload };

    case "SET_ERROR":
      return { ...state, usersError: action.payload };

    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [persistedTasks, setPersistedTasks] =
    useLocalStorage<Task[]>("tasks", []);

  const [state, dispatch] = useReducer(reducer, {
    tasks: persistedTasks,
    users: [],
    loadingUsers: true,
    usersError: "",
  });

  // Sync reducer state with localStorage
  useEffect(() => {
    setPersistedTasks(state.tasks);
  }, [state.tasks, setPersistedTasks]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const res = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        dispatch({ type: "SET_USERS", payload: data });
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Unable to load users.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUsers();
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("Must be used inside provider");
  return context;
};