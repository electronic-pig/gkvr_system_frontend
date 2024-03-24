import { createRouter, createWebHistory } from "vue-router";
import PortalView from "../views/PortalView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "portal",
      component: PortalView,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
  ],
});

export default router;
