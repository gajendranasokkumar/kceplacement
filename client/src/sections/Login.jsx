import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import { useAppContext } from "../context/AppContext"; // Import the context

const Login = ({ setToken }) => {
  const { API_URL } = useAppContext(); // Access the API URL from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(data.token);
      toast.success("Login Successful");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card className="w-96 shadow-lg p-6 border border-gray-200">
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Login</h2>
          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
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
