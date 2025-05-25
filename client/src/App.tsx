import { RouterProvider } from 'react-router-dom'
import './App.css'
import './index.css'
import { router } from './routers'
function App() {
  return (
    <>
      <div className="text-red-500 text-2xl font-bold">
        Hello!
      </div>
      <RouterProvider router={router} />
    </>
  )
}

export default App
