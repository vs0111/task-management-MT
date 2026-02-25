import { useTaskContext } from "../context/TaskContext";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: Props) => {
  const { state, dispatch } = useTaskContext();

  const assigneeName =
    state.users.find((u) => u.id === task.assignee)?.name ||
    "Unassigned";

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>

      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Assignee:</strong> {assigneeName}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() =>
            dispatch({ type: "DELETE_TASK", payload: task.id })
          }
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;