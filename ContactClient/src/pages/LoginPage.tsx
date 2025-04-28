// const LoginPage = () => {
//     return (
//         <div className="h-screen bg-[#68646434] w-full flex items-center justify-center"></div>
//     );
// };

// export default LoginPage;
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = (document.getElementById("loginUsername") as HTMLInputElement).value;
    const password = (document.getElementById("loginPassword") as HTMLInputElement).value;

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }
    alert(`Login attempted with Username: ${username}`);
    // Reset form (optional in React, handled by state if using controlled inputs)
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = (document.getElementById("registerUsername") as HTMLInputElement).value;
    const email = (document.getElementById("registerEmail") as HTMLInputElement).value;
    const password = (document.getElementById("registerPassword") as HTMLInputElement).value;
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert(`Registration attempted with Username: ${username}, Email: ${email}`);
    // Reset form (optional in React)
  };

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4 p-2 bg-blue-100">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 font-semibold rounded-l-lg ${
              isLogin ? "bg-blue-300 text-white" : "bg-blue-100 text-blue-700"
            } transition-colors duration-300`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 font-semibold rounded-r-lg ${
              !isLogin ? "bg-blue-300 text-white" : "bg-blue-100 text-blue-700"
            } transition-colors duration-300`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms Container with Transition */}
        <div className="flex transition-transform duration-500 ease-in-out">
          {/* Login Form */}
          <form
            onSubmit={handleLoginSubmit}
            className={`w-full p-6 flex flex-col space-y-4 ${
              isLogin ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-500 ease-in-out`}
            style={{ minHeight: "300px" }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">LOGIN</h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">👤</span>
              <label htmlFor="loginUsername" className="text-sm text-blue-700">Username</label>
            </div>
            <input
              type="text"
              id="loginUsername"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your username"
              required
            />
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">🔒</span>
              <label htmlFor="loginPassword" className="text-sm text-blue-700">Password</label>
            </div>
            <input
              type="password"
              id="loginPassword"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors duration-300 mt-4"
            >
              LOGIN
            </button>
            <p className="text-center text-blue-600 text-sm mt-2">
              Forgot Password? <span className="underline cursor-pointer">Reset</span>
            </p>
          </form>

          {/* Register Form */}
          <form
            onSubmit={handleRegisterSubmit}
            className={`w-full p-6 flex flex-col space-y-4 ${
              !isLogin ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-in-out`}
            style={{ minHeight: "300px" }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">SIGN UP</h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">👤</span>
              <label htmlFor="registerUsername" className="text-sm text-blue-700">Username</label>
            </div>
            <input
              type="text"
              id="registerUsername"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your username"
              required
            />
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">📧</span>
              <label htmlFor="registerEmail" className="text-sm text-blue-700">Email</label>
            </div>
            <input
              type="email"
              id="registerEmail"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your email"
              required
            />
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">🔒</span>
              <label htmlFor="registerPassword" className="text-sm text-blue-700">Password</label>
            </div>
            <input
              type="password"
              id="registerPassword"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Enter your password"
              required
            />
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-500">🔐</span>
              <label htmlFor="confirmPassword" className="text-sm text-blue-700">Confirm Password</label>
            </div>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Confirm your password"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors duration-300 mt-4"
            >
              CREATE ACCOUNT
            </button>
            <p className="text-center text-blue-600 text-sm mt-2">
              Already have an account? <span onClick={handleToggle} className="underline cursor-pointer">Login here</span>
            </p>
          </form>
        </div>
      </div>

      {/* Mobile Toggle (Optional) */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
        <button
          onClick={handleToggle}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-colors duration-300"
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );

};

export default LoginPage;