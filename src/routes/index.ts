import React from "react";

const routes = [
  {
    path: "/",
    component: React.lazy(() => import("../pages/add-version")),
    exact: true,
  },
  {
    path: "/edit-version",
    component: React.lazy(() => import("../pages/edit-version")),
    exact: true,
  },
];

export default routes;
