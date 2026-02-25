import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "./ConfirmModal";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: Props) => {
  const { state, dispatch } = useTaskContext();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const assigneeName =
    state.users.find((u) => u.id === task.assignee)?.name ||
    "Unassigned";

  const handleDelete = () => {
    dispatch({ type: "DELETE_TASK", payload: task.id });
    showToast("Task deleted successfully");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="font-semibold text-lg">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-600">
            {task.description}
          </p>
        )}

        <div className="text-sm space-y-1">
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assignee:</strong> {assigneeName}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Task"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              "{task.title}"
            </span>
            ? This action cannot be undone.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;