import { useTaskContext } from "../context/TaskContext";
import type{ Task, Status } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  onEdit: (task: Task) => void;
  activeStatus: Status | "All";
}

const TaskList = ({ onEdit, activeStatus }: Props) => {
  const { state } = useTaskContext();

  if (state.tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No tasks yet. Start by creating one.
      </div>
    );
  }

  const filteredTasks =
    activeStatus === "All"
      ? state.tasks
      : state.tasks.filter((task) => task.status === activeStatus);

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No tasks found for this status.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TaskList;