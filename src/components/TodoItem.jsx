import React from "react";

export default function TodoItem({ item, onToggle, onArchive, onRemove }) {
  const dueDate = item.due ? new Date(item.due) : null;

  return (
    <div className={`todo-item ${item.done ? "done" : ""}`}>
      <input type="checkbox" checked={item.done} onChange={onToggle} />
      <div className="todo-text">
        <p>{item.text}</p>
        {item.tags.length > 0 && (
          <div className="tags">
            {item.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}
        {dueDate && <small>Due: {dueDate.toLocaleDateString()}</small>}
      </div>
      <div className="actions">
        <button onClick={onArchive}>{item.archived ? "Unarchive" : "Archive"}</button>
        <button onClick={onRemove}>Delete</button>
      </div>
    </div>
  );
}
