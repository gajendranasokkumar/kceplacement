import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import { useAppContext } from "../context/AppContext";

const Login = ({ setToken }) => {
  const { API_URL } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", data.token); // Store token in localStorage
      setToken(data.token); // Update token in the app context
      toast.success("Login Successful");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Card className="w-96 shadow-2xl p-8 border border-gray-200 bg-white rounded-lg">
        <CardContent className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Login to your account</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
