import { useAuthContext } from '@/hook/Auth/useAuthContext';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeaderPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthContext();


  const [darkMode, setDarkMode] = useState(() => {
    // lấy từ localStorage nếu có
    return localStorage.getItem("theme") === "dark"
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        My Website
      </h1>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="text-red-600 hover:underline">
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          onClick={() => (window.location.href = "/auth/login")}
          className="text-blue-600 hover:underline"
        >
          Đăng nhập
        </button>
      )}

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>
    </header>
  )
}

export default HeaderPage