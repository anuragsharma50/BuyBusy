import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import Cart from "./pages/Cart/Cart";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

import "./firebaseInit.js";

import './App.css';
import Home from './pages/Home/Home';
import Nav from "./Components/Nav/Nav";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

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
      <Provider store={store} >
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
