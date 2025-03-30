import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaBuilding, FaPlus, FaCheck, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import { useAppContext } from "../context/AppContext"; // Import the context

const Dashboard = ({ token }) => {
  const { API_URL } = useAppContext(); // Access the API URL from context
  const [students, setStudents] = useState([]);
  const [userName, setUserName] = useState("John Doe"); // Example user name
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalDepartments: 0,
  });

  // To-Do State
  const [todoLists, setTodoLists] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [selectedListId, setSelectedListId] = useState(null);
  const [editingList, setEditingList] = useState(null); // Track which list is being edited

  // Fetch data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/dashboard/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(data);
        setStatistics((prev) => ({
          ...prev,
          totalStudents: data.length,
        }));
      } catch (error) {
        toast.error("Failed to fetch students");
      }
    };

    const fetchStatistics = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/dashboard/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatistics(data);
      } catch (error) {
        toast.error("Failed to fetch statistics");
      }
    };

    const fetchTodoLists = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/dashboard/todo-lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodoLists(data);
        if (data.length > 0) setSelectedListId(data[0]._id); // Select the first list by default
      } catch (error) {
        toast.error("Failed to fetch to-do lists");
      }
    };

    fetchStudents();
    fetchStatistics();
    fetchTodoLists();
  }, [API_URL, token]);

  // Add a new To-Do
  const addTodo = async () => {
    if (!newTodoText.trim() || !newTodoDueDate.trim()) {
      toast.error("Please enter a to-do and due date");
      return;
    }

    console.log("Adding To-Do:", {
      selectedListId,
      text: newTodoText,
      dueDate: newTodoDueDate,
    });

    try {
      const { data } = await axios.post(
        `${API_URL}/dashboard/todo-lists/${selectedListId}/todos`,
        { text: newTodoText, dueDate: newTodoDueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoLists((prev) =>
        prev.map((list) =>
          list._id === selectedListId
            ? { ...list, todos: [...list.todos, data] }
            : list
        )
      );
      setNewTodoText("");
      setNewTodoDueDate("");
      toast.success("To-Do Added");
    } catch (error) {
      console.error("Error adding To-Do:", error.response?.data || error.message);
      toast.error("Failed to add to-do");
    }
  };

  // Toggle To-Do Completion
  const toggleTodoCompletion = async (listId, todoId, completed) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/dashboard/todo-lists/${listId}/todos/${todoId}`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoLists((prev) =>
        prev.map((list) =>
          list._id === listId
            ? {
                ...list,
                todos: list.todos.map((todo) =>
                  todo._id === todoId ? data : todo
                ),
              }
            : list
        )
      );
      toast.success("To-Do Updated");
    } catch (error) {
      toast.error("Failed to update to-do");
    }
  };

  // Add a new To-Do List
  const addTodoList = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/dashboard/todo-lists`,
        { title: `New List ${todoLists.length + 1}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoLists([...todoLists, data]);
      setSelectedListId(data._id);
      toast.success("New To-Do List Created");
    } catch (error) {
      toast.error("Failed to create to-do list");
    }
  };

  // Delete a To-Do List
  const deleteTodoList = async (listId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/dashboard/todo-lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodoLists((prev) => prev.filter((list) => list._id !== listId));
      toast.success("To-Do List Deleted");
    } catch (error) {
      toast.error("Failed to delete to-do list");
    }
  };

  // Handle list name input changes
  const handleListNameChange = (listId, newName) => {
    setTodoLists((prev) =>
      prev.map((list) =>
        list._id === listId ? { ...list, title: newName } : list
      )
    );
  };

  // Update List Name when Enter key is pressed or input loses focus
  const updateListName = async (listId, newName, event) => {
    // Only update on Enter key press or when input loses focus (blur)
    if (event && event.key !== "Enter" && event.type !== "blur") {
      return;
    }
    
    try {
      const { data } = await axios.put(
        `${API_URL}/dashboard/todo-lists/${listId}`,
        { title: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? data : list))
      );
      setEditingList(null); // Clear editing state
      toast.success("List name updated");
    } catch (error) {
      toast.error("Failed to update list name");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-700">Welcome to the Dashboard</h2>
        <p className="text-lg font-medium text-gray-600">Hello, {userName}</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <FaUserGraduate className="text-5xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Students</h3>
            <p className="text-3xl font-bold">{statistics.totalStudents}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <FaChalkboardTeacher className="text-5xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Teachers</h3>
            <p className="text-3xl font-bold">{statistics.totalTeachers}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <FaBook className="text-5xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Courses</h3>
            <p className="text-3xl font-bold">{statistics.totalCourses}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <FaBuilding className="text-5xl" />
          <div>
            <h3 className="text-lg font-semibold">Total Departments</h3>
            <p className="text-3xl font-bold">{statistics.totalDepartments}</p>
          </div>
        </div>
      </div>

      {/* To-Do Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        {/* Add To-Do Form */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Add To-Do</h4>
          <div className="flex items-center space-x-4">
            <select
              value={selectedListId || ""} // Fix for null value
              onChange={(e) => setSelectedListId(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {todoLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.title}
                </option>
              ))}
            </select>
            <Input
              placeholder="To-Do Text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">To-Do Lists</h3>
          <button
            onClick={addTodoList}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Add New List
          </button>
        </div>

        {/* To-Do Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {todoLists.map((list) => (
            <div
              key={list._id}
              className={`p-4 rounded-lg shadow-md ${
                list._id === selectedListId ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={list.title}
                  onChange={(e) => handleListNameChange(list._id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateListName(list._id, list.title, e);
                    }
                  }}
                  onBlur={(e) => updateListName(list._id, list.title, e)}
                  onFocus={() => setEditingList(list._id)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <FaEdit className="text-gray-500" />
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteTodoList(list._id)}
                  />
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {list.todos.map((todo, index) => (
                  <li
                    key={todo._id || `${list._id}-${index}`} // Use todo._id or fallback to a combination of list._id and index
                    className={`p-2 rounded-lg flex justify-between items-center ${
                      todo.completed ? "bg-green-100" : "bg-white"
                    }`}
                  >
                    <span
                      className={`${
                        todo.completed ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.text}
                      </span>{" "}
                      - <small>{todo.dueDate}</small>
                    </span>
                    <button
                      onClick={() =>
                        toggleTodoCompletion(list._id, todo._id, !todo.completed)
                      }
                      className={`p-2 rounded-full ${
                        todo.completed
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      <FaCheck />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;