import { createApp } from "vue";
import App from "./App.vue";
import "./global_css/reset.scss";
import "animate.css";
import router from "./router/index.js";
createApp(App).use(router).mount("#app");

// Check if it is https:
function redirectToHttps() {
  if (
    location.protocol !== "https:" &&
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1"
  ) {
    location.href =
      "https:" +
      window.location.href.substring(window.location.protocol.length);
  }
}

//redirectToHttps();
