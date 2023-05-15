<script setup>
import HomePage from './pages/HomePage.vue'
import 'boxicons'
// Default theme
import '@splidejs/splide/css';


</script>

<template>
  <HomePage />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&display=swap');
@import "@/global_css/variables.scss";

* {
  font-size: 62.5%; // 1rem = 10px
  font-family: 'Rajdhani', sans-serif;
}

body {

  line-height: 1.5;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100vh;
  min-height: 750px;
  min-height: -webkit-fill-available;
  background-color: darken($color2-bg, 10%);

}

@media (max-width: 319px) {
  body {
    overflow-x: scroll;
  }
}

@media (max-height: 750px) {
  body {
    overflow-y: scroll;
  }
}

// Disable hover effect on touch devices
@media (hover: none) {

  *,
  *:before,
  *:after {
    transition-duration: 0s !important;
  }

  // Generally activate effects if the element has this class
  .keep-transition:hover,
  .keep-transition:active,
  .keep-transition:focus,
  .keep-transition:visited,
  .keep-transition:target,
  .keep-transition:link,
  .keep-transition {
    transition-duration: inherit !important;
  }
}
</style>
