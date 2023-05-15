import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes/index.js";
import NotFoundPage from "@/pages/NotFoundPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    {
      path: "/:pathMatch(.*)",
      component: NotFoundPage,
    },
  ],
});
router.beforeEach((to, from, next) => {
  const timeout = 2000; // Zeit in Millisekunden, die die Animation dauert
  setTimeout(() => {
    next();
  }, timeout);
});
export default router;
