import TheHome from "@/components/TheHome.vue";
import TheProjects from "@/components/TheProjects.vue";
import TheContact from "@/components/TheContact.vue";

const appRoutes = [
  { path: "/randomcgi/", component: TheHome },
  { path: "/randomcgi/projects", component: TheProjects },
  { path: "/randomcgi/contact", component: TheContact },
];

export default appRoutes;
