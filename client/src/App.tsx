import { RouterProvider } from "react-router-dom";
import "./App.css";
import "./index.css";
import { router } from "./routers";
// import SplashCursor from './components/SplashCursor'
import { Toaster } from "sonner";
function App() {
  return (
    <>

      <Toaster position="top-right" richColors />
      {/* <SplashCursor /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
