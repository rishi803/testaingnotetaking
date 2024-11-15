import React, { useState, useEffect } from "react";
import "./App.css";

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const[newTodoDesc, setNewTodoDesc] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrEditTodo = () => {
    if (newTodo.trim() && newTodoDesc.trim()) {
      if (editingIndex !== null) {
        // Edit existing todo
        const updatedTodos = todos.map((todo, i) =>
          i === editingIndex ? { ...todo, text: newTodo, description:newTodoDesc } : todo
        );
        setTodos(updatedTodos);
        setEditingIndex(null); // Reset editing mode
      } else {
        // Add new todo
        setTodos([...todos, { text: newTodo, description:newTodoDesc, completed: false }]);
      }
      setNewTodo("");
      setNewTodoDesc("")
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEditTodo = (index) => {
    setNewTodo(todos[index].text);
    setNewTodoDesc(todos[index].description)
    setEditingIndex(index);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true; // "all"
  });

  return (
    <div className="todo-container">
      <h1 className="app-title">Todo App</h1>

      <div className="todo-input-container">
        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:"10px"
        }} className="inputs">
        <input
          type="text"
          placeholder={
            editingIndex !== null ? "Edit task..." : "Title of new task..."
          }
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
        />
         <input
          type="text"
          placeholder={
            editingIndex !== null ? "Edit task..." : "Description of new task..."
          }
          value={newTodoDesc}
          onChange={(e) => setNewTodoDesc(e.target.value)}
          className="todo-input"
        />
        </div>
        <button onClick={handleAddOrEditTodo} className="add-btn">
          {editingIndex !== null ? "Edit" : "Add"}
        </button>
      </div>

      <div className="filter-container">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`completed ${filter === "completed" ? "active" : ""}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`pending ${filter === "pending" ? "active" : ""}`}
        >
          Pending
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="no-todos">No todos to show</li>
        ) : (
          filteredTodos.map((todo, index) => (
            <li
              key={index}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <div style={{maxWidth:"400px"}}>
              <span style={{fontWeight:"bold", color:"gold"}}>{todo.text}</span>
              <p style={{maxWidth:"400px"}}>{todo.description}</p>
              </div>
             
              <div className="actions">
                <button
                  onClick={() => handleToggleComplete(index)}
                  className="complete-btn"
                >
                  ✔
                </button>
                <button
                  onClick={() => handleEditTodo(index)}
                  className="edit-btn"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTodo(index)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoApp;
