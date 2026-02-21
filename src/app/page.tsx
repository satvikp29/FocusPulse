"use client";

import { useState, useEffect, useCallback } from "react";

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;

type Mode = "work" | "shortBreak" | "longBreak";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const getTotalSeconds = useCallback((m: Mode) => {
    if (m === "work") return WORK_MINUTES * 60;
    if (m === "shortBreak") return SHORT_BREAK_MINUTES * 60;
    return LONG_BREAK_MINUTES * 60;
  }, []);

  const switchMode = useCallback(
    (next: Mode) => {
      setMode(next);
      setSecondsLeft(getTotalSeconds(next));
      setIsRunning(false);
    },
    [getTotalSeconds]
  );

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => setTasks(data.tasks ?? []))
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  const addTask = async () => {
    const title = newTask.trim();
    if (!title) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    if (data.task) {
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const display = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-amber-400">
            FocusPulse
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Pomodoro timer & simple task list. No API keys.
          </p>
        </header>

        <div className="flex justify-center gap-2">
          {(["work", "shortBreak", "longBreak"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === m
                  ? "bg-amber-500 text-stone-900"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              {m === "work"
                ? "Focus"
                : m === "shortBreak"
                  ? "Short"
                  : "Long"}
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="text-6xl font-mono font-light text-amber-400 tracking-wider">
            {display}
          </div>
          <button
            onClick={() => setIsRunning((r) => !r)}
            className="mt-4 px-6 py-2 rounded-lg bg-amber-500 text-stone-900 font-medium hover:bg-amber-400"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>

        <section className="border-t border-stone-800 pt-6">
          <h2 className="text-sm font-medium text-stone-400 mb-3">Tasks</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={addTask}
              className="px-4 py-2 rounded-lg bg-stone-700 text-stone-200 text-sm font-medium hover:bg-stone-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-lg bg-stone-900/60 px-3 py-2 group"
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                  className="rounded border-stone-600 bg-stone-800 text-amber-500 focus:ring-amber-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    t.completed ? "text-stone-500 line-through" : ""
                  }`}
                >
                  {t.title}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-red-400 text-xs"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
