import React from "react";

const routes = [
  {
    path: "/add-version",
    component: React.lazy(() => import("../pages/add-version")),
    exact: true,
  },
  {
    path: "/edit-version",
    component: React.lazy(() => import("../pages/edit-version")),
    exact: true,
  },
  {
    path: "/pipe-router",
    component: React.lazy(() => import("../pages/pipe-router")),
    exact: true,
  },
];

export default routes;
