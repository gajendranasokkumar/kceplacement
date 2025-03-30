import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaBuilding, FaPlus, FaCheck, FaEdit } from "react-icons/fa"; // Import icons
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

  // Update List Name
  const updateListName = async (listId, newName) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/dashboard/todo-lists/${listId}`,
        { title: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoLists((prev) =>
        prev.map((list) => (list._id === listId ? data : list))
      );
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
              value={selectedListId}
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
                  onChange={(e) => updateListName(list._id, e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <FaEdit className="text-gray-500" />
              </div>
              <ul className="mt-4 space-y-2">
                {list.todos.map((todo) => (
                  <li
                    key={todo._id}
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

      {/* Student List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card
            key={student._id}
            className="shadow-lg border border-gray-200 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent>
              <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
              <p className="text-gray-600">Reg No: {student.regNo}</p>
              <p className="text-gray-600">Dept: {student.department}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;