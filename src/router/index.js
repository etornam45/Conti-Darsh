import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/signin",
    component: () => import("../views/SignIn.vue"),
    name: "signin",
  },
  {
    path: "/",
    component: () => import("../views/Bookings.vue"),
    name: "bookings",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
