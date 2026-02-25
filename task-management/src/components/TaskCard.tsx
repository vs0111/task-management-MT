import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import ConfirmModal from "./ConfirmModal";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: Props) => {
  const { state, dispatch } = useTaskContext();
  const [open, setOpen] = useState(false);

  // Assignee display logic
  let assigneeDisplay = "Unassigned";

  if (state.loadingUsers) {
    assigneeDisplay = "Loading...";
  } else {
    const user = state.users.find(
      (u) => u.id === task.assignee
    );

    if (user) {
      assigneeDisplay = user.name;
    }
  }

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
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Assignee:</strong>{" "}
            {state.loadingUsers ? (
              <span className="inline-block h-4 w-20 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              assigneeDisplay
            )}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(task)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={() => setOpen(true)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        title="Delete Task"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              "{task.title}"
            </span>
            ?
          </>
        }
        onConfirm={() => {
          dispatch({
            type: "DELETE_TASK",
            payload: task.id,
          });
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default TaskCard;