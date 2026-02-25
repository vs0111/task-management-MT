import { useState, useEffect } from "react";
import type{ Task } from "../types/task";
import { useTaskContext } from "../context/TaskContext";

interface Props {
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

const TaskForm = ({ editingTask, setEditingTask }: Props) => {
  const { dispatch } = useTaskContext();

  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "",
    status: "",
    assignee: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      const { id, ...rest } = editingTask;
      setFormData(rest);
    }
  }, [editingTask]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (editingTask) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { ...editingTask, ...formData },
      });
      setEditingTask(null);
    } else {
      dispatch({
        type: "ADD_TASK",
        payload: { id: crypto.randomUUID(), ...formData },
      });
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>

      <div>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title *"
          className={`w-full border p-2 rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border border-gray-300 p-2 rounded"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className={`w-full border p-2 rounded ${
          !formData.priority ? "text-gray-400" : "text-black"
        }`}
      >
        <option value="" disabled>Select Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className={`w-full border p-2 rounded ${
          !formData.status ? "text-gray-400" : "text-black"
        }`}
      >
        <option value="" disabled>Select Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <input
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        placeholder="Assignee"
        className="w-full border border-gray-300 p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;