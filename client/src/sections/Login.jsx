import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import { useApi } from "../api/api"; // Import the API utility
import Cookies from "js-cookie";

const Login = ({ setToken }) => {
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      const expiryDate = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
      Cookies.set("token", data.token, { expires: expiryDate });
      Cookies.set("userId", data.userId, { expires: expiryDate });

      setToken(data.token);
      toast.success("Login Successful");
    } catch (error) {
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Card className="w-96 shadow-2xl p-8 border border-gray-200 bg-white rounded-lg">
        <CardContent className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome Back
          </h2>
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
              className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:bg-blue-600 hover:pointer cursor-pointer transition duration-200 ease-in-out flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              )}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
