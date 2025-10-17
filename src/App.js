import React from "react";
import TodoApp from "./components/TodoApp";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <div className="todo-wrapper">
        <header>
          <h1>Smart · Pretty · Todo</h1>
          <p>A clean todo app with smart parsing, tags & priorities.</p>
        </header>
        <main>
          <TodoApp />
        </main>
        <footer>Made with ❤️ — Smart Pretty Todo</footer>
      </div>
    </div>
  );
}
