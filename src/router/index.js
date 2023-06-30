import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    name: "home",
  },
  {
    path: "/students",
    component: () => import("../views/Students.vue"),
    name: "students",
  },
  {
    path: "/bookings",
    component: () => import("../views/Bookings.vue"),
    name: "bookings",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
