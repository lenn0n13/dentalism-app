import React from 'react'
import { Provider } from "react-redux";
import store from '@store/store';
import "@assets/css/main.css";
import "react-datepicker/dist/react-datepicker.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import Landing from '@pages/Landing/Landing';
import Dashboard from '@pages/Dashboard/Dashboard';
import Login from '@pages/Login/Login';
import AuthContextProvider from '@pages/Contexts/AuthContext';

const queryClient = new QueryClient()

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthContextProvider><Landing /></AuthContextProvider>
    },
    {
      path: "/login",
      element: <AuthContextProvider><Login /></AuthContextProvider>
    },
    {
      path: "/dashboard",
      element: <AuthContextProvider>
        <Dashboard />
      </AuthContextProvider>
    },
  ]);

  return <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>
}

export default App