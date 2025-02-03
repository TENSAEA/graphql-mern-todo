import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';
// import { RotatingLines } from "react-loader-spinner";

import {
  CREATE_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from "../graphql/mutations/todo.mutation";
import { GET_TODOS } from "../graphql/queries/todo.query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_AUTH_USER } from "../graphql/queries/user.query";

const TodoList = ({ userID }) => {
  const [title, setTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  // Use the userID prop in the query
  const { data } = useQuery(GET_TODOS, {
    variables: { userID },
  });

  const [logout, { loading,client }] = useMutation(LOGOUT);
  const [createTodo] = useMutation(
    CREATE_TODO,
    {
      refetchQueries: [{ query: GET_TODOS, variables: { userID } }],
    }
  );
  const [updateTodo] =
    useMutation(UPDATE_TODO, {
      refetchQueries: [{ query: GET_TODOS, variables: { userID } }],
    });
  const [deleteTodo] =
    useMutation(DELETE_TODO, {
      refetchQueries: [{ query: GET_TODOS, variables: { userID } }],
    });

    const { data: authUserData }= useQuery(GET_AUTH_USER, {
      refetchQueries: [{ query: GET_TODOS, variables: { userID } }],
    })

    // function Loader() {
    //   return (
    //     <RotatingLines
    //       strokeColor="grey"
    //       strokeWidth="5"
    //       animationDuration="0.75"
    //       width="96"
    //       visible={true}

    //     />
    //   )
    // }

  const handleCreateTodo = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }
    try {
      await createTodo({ variables: { title, userID } }); // Include userID when creating a todo
      setTitle("");
      toast.success("Todo created successfully!");
    } catch (errorCaught) {
      console.error("Create todo error:", errorCaught);
      toast.error("Failed to create todo. Please try again.");
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEditingTodoId(todo.id);
  };

  const handleSaveTodo = async (todoId) => {
    if (!editingTodoId || !title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }

    const todo = data?.todos.find((todo) => todo.id === todoId);
    const completed = todo.completed;

    try {
      await updateTodo({
        variables: {
          id: editingTodoId,
          title,
          completed,
        },
      });

      setTitle("");

      setEditingTodoId(null);
      toast.success("Todo updated successfully!");
    } catch (errorCaught) {
      console.error("Update todo error:", errorCaught);
      toast.error("Failed to update todo. Please try again.");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo({ variables: { id: todoId } });
      toast.success("Todo deleted successfully!");
    } catch (errorCaught) {
      console.error("Delete todo error:", errorCaught);
      toast.error("Failed to delete todo. Please try again.");
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const todo = data?.todos.find((todo) => todo.id === todoId);
      if (!todo) {
        toast.error("Todo not found!");
        return;
      }
      await updateTodo({
        variables: {
          id: todoId,
          title: todo.title,
          completed: !todo.completed,
        },
      });
      toast.success("Todo updated successfully!");
    } catch (errorCaught) {
      console.error("Update todo error:", errorCaught);
      toast.error("Failed to update todo. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
       await logout();
      client.resetStore();
      toast.success("Logged out successfully!");
    } catch (errorCaught) {
      console.error("Logout error:", errorCaught);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const navigate = useNavigate();

  const home = () => {
    navigate("/todos");
  };

  // if (todosError) return <p>Error: {todosError.message}</p>;
//   if (todosLoading) return (
//   <div className="flex justify-center items-center h-screen">
//     <Loader />
//   </div>
// );

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Header Section */}
      <div className="col-start-2 col-end-12 md:col-start-3 md:col-end-11">
        <div className="flex justify-between items-center">
          <h1
            className="cursor-pointer font-bold text-2xl text-blue-700 p-3"
            onClick={home}
          >
            Todo List
          </h1>

          <div className="flex items-center">
            <p className="text-gray-500 text-sm ml-1.5">
              Welcome, {authUserData.authUser.username} 
            </p>
          </div>

          <button
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="col-start-2 col-end-12 md:col-start-4 md:col-end-10">
        <div className="flex flex-col items-center w-full">
          {/* Input and Button Section */}
          <div className="flex flex-wrap w-full items-center">
            <input
              type="text"
              placeholder="Add a new todo"
              className="outline-none border border-gray-300 rounded-md p-3 flex-grow m-2 w-full md:w-auto"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={() =>
                editingTodoId ? handleSaveTodo(editingTodoId) : handleCreateTodo()
              }
              className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-xl ml-2 ${
                editingTodoId ? "bg-green-500 hover:bg-green-700" : ""
              }`}
            >
              {editingTodoId ? "Save" : "Add"}
            </button>
          </div>

          {/* Todo List Section */}
          <div className="w-full">
            <ul className="list-none p-0 w-full">
              {data?.todos.map((todo, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-2 rounded-md m-2 flex items-center justify-between w-full"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      onChange={() => handleToggleTodo(todo.id)}
                      checked={todo.completed}
                    />
                    <span
                      className={
                        todo.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

TodoList.propTypes = {
  userID: PropTypes.string.isRequired,
};

export default TodoList;
