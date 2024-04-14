import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import Cart from "./pages/Cart/Cart";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

import "./firebaseInit.js";

import './App.css';
import Home from './pages/Home/Home';
import Nav from "./Components/Nav/Nav";
import { ItemsProvider } from "./ItemsProvider";
import { AuthProvider } from "./AuthProvider";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Nav /> , children: [
      { index:true, element: <Home /> },
      { path: "/orders", element: <Orders /> },
      { path: "/cart", element:<Cart />  },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ]}
  ])

  return (
    <div>
      <AuthProvider>
        <ItemsProvider>
          <RouterProvider router={router} />
        </ItemsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
