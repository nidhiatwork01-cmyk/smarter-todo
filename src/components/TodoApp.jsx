import React, { useEffect, useMemo, useState } from "react";
import TodoItem from "./TodoItem";

const STORAGE_KEY = "smart-pretty-todo:v1";

function parseSmartInput(text) {
  const result = { text: text.trim(), due: null, priority: "normal", tags: [] };

  if (/!!!/.test(text)) result.priority = "critical";
  else if (/!!/.test(text)) result.priority = "high";

  const tagMatches = [...text.matchAll(/#(\\w[\\w-]*)/g)].map((m) => m[1]);
  if (tagMatches.length) result.tags = tagMatches;

  if (/\\btoday\\b/i.test(text)) result.due = new Date().toISOString();
  else if (/\\btomorrow\\b/i.test(text)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    result.due = d.toISOString();
  }

  result.text = result.text.replace(/!!!|!!|!/g, "");
  result.text = result.text.replace(/#(\\w[\\w-]*)/g, "").trim();

  return result;
}

export default function TodoApp() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addTodo = (rawText) => {
    if (!rawText.trim()) return;
    const parsed = parseSmartInput(rawText);
    const newTodo = {
      id: Date.now(),
      text: parsed.text,
      createdAt: new Date().toISOString(),
      due: parsed.due,
      priority: parsed.priority,
      tags: parsed.tags,
      done: false,
      archived: false,
    };
    setItems((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleDone = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  const toggleArchive = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, archived: !it.archived } : it)));
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const visible = useMemo(
    () =>
      items.filter(
        (it) =>
          (showArchived ? true : !it.archived) &&
          (query.trim() === "" ||
            [it.text, ...it.tags].join(" ").toLowerCase().includes(query.toLowerCase()))
      ),
    [items, query, showArchived]
  );

  return (
    <div className="todo-app">
      <div className="todo-inputs">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo(input)}
          placeholder="Add todo — e.g. Buy milk tomorrow !! #groceries"
        />
        <button onClick={() => addTodo(input)}>Add</button>
      </div>

      <div className="todo-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search todos"
        />
        <button onClick={() => setShowArchived((s) => !s)}>
          {showArchived ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      <div className="todo-list">
        {visible.length === 0 ? (
          <p className="empty">No todos yet — add one above.</p>
        ) : (
          visible.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={() => toggleDone(item.id)}
              onArchive={() => toggleArchive(item.id)}
              onRemove={() => remove(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
