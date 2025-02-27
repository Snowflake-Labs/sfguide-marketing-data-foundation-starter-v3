import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

export const renderWithContext = (children: ReactNode) => {
    const contexts = () => {
      const router = createBrowserRouter([{
        path: "/",
        element: children,
        children: []
      }]);
      return (
        <RouterProvider router={router}/>
      );
    };
  
    return render(contexts());
  };