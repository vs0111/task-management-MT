import { useTaskContext } from "../context/TaskContext";
import type { Task, Status } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  onEdit: (task: Task) => void;
  activeStatus: Status | "All";
}

const TaskList = ({ onEdit, activeStatus }: Props) => {
  const { state } = useTaskContext();

  if (state.tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No tasks yet.
      </div>
    );
  }

  const filtered =
    activeStatus === "All"
      ? state.tasks
      : state.tasks.filter((t) => t.status === activeStatus);

  if (filtered.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No tasks for this status.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {filtered.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TaskList;