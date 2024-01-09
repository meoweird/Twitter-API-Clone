/* eslint-disable react/jsx-no-target-blank */
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
