import { useEffect, useState } from 'react'

const HeaderPage = () => {
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
  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        My Website
      </h1>

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