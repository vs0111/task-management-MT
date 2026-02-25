import { useState, useEffect, useMemo } from "react";
import { useTaskContext } from "../context/TaskContext";
import type { Task, Status, Priority } from "../types/task";
import TaskCard from "./TaskCard";

interface Props {
  onEdit: (task: Task) => void;
}

const TaskList = ({ onEdit }: Props) => {
  const { state } = useTaskContext();
  const { tasks } = state;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<Status | "All">("All");
  const [priorityFilter, setPriorityFilter] =
    useState<Priority | "All">("All");

  // Debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter]);

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center text-gray-500">
        <p className="text-lg font-medium">
          No tasks yet
        </p>
        <p className="text-sm">
          Start by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as Status | "All")
            }
            className="border p-2 rounded"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value as Priority | "All"
              )
            }
            className="border p-2 rounded"
          >
            <option value="All">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Cards */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center text-gray-500">
          <p className="text-lg font-medium">
            No tasks found
          </p>
          <p className="text-sm">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;