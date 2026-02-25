import { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import type { Task } from "../types/task";

interface Props {
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

const TaskForm = ({ editingTask, setEditingTask }: Props) => {
  const { state, dispatch } = useTaskContext();
  const { users, loadingUsers, usersError } = state;
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "",
    status: "",
    assignee: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    priority: "",
    status: "",
  });

  useEffect(() => {
    if (editingTask) {
      const { id, ...rest } = editingTask;
      setFormData(rest);
    }
  }, [editingTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "assignee") {
      setFormData({ ...formData, assignee: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {
      title: "",
      priority: "",
      status: "",
    };

    if (!formData.title.trim())
      newErrors.title = "Title is required";
    if (!formData.priority)
      newErrors.priority = "Priority is required";
    if (!formData.status)
      newErrors.status = "Status is required";

    setErrors(newErrors);

    return !newErrors.title &&
      !newErrors.priority &&
      !newErrors.status;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTask) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { ...editingTask, ...formData },
      });
      showToast("Task updated successfully");
      setEditingTask(null);
    } else {
      dispatch({
        type: "ADD_TASK",
        payload: { id: crypto.randomUUID(), ...formData },
      });
      showToast("Task created successfully");
    }

    setFormData({
      title: "",
      description: "",
      priority: "",
      status: "",
      assignee: "",
    });
  };

  return (
    <form
      className="bg-white p-6 rounded shadow space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>

      <div>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">
            {errors.title}
          </p>
        )}
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <div>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <p className="text-red-500 text-sm">
            {errors.priority}
          </p>
        )}
      </div>

      <div>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">
            {errors.status}
          </p>
        )}
      </div>

      {loadingUsers && (
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      )}

      {!loadingUsers && !usersError && (
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Assignee</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      )}

      {usersError && (
        <p className="text-red-500 text-sm">
          {usersError}
        </p>
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;