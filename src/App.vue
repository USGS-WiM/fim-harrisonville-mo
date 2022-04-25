<template>
  <v-app>
    <v-app-bar dark clipped-left app class="toolbar">
      <v-app-bar-nav-icon @click="drawerState = !drawerState"></v-app-bar-nav-icon>
      <v-toolbar-title class="title">
        Muddy Creek at Harrisonville Precipitation-Driven Flood Inundation Mapper
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <UserGuide></UserGuide>
      <About></About>
    </v-app-bar>

    <Sidebar></Sidebar>
    <Map></Map>
  </v-app>
</template>

<script>
// imports
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import About from "./components/About";
import UserGuide from "./components/UserGuide";
export default {
  components: {
    Sidebar,
    Map,
    About,
    UserGuide
  },
  computed: {
    drawerState: {
      get () { return this.$store.getters.drawerState },
      set (v) { return this.$store.commit('toggleDrawerState', v) }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Public+Sans:100,300,400,500,700,900");

html {
  overflow-y: auto;
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  overflow: hidden;
}

html,
body {
  font-family: "Public Sans", sans-serif;
  color: #333;
}

#app {
  font-family: "Public Sans", sans-serif !important;
  color: #333;
}

.v-application .title {
  font-family: "Public Sans", sans-serif !important;
}

.toolbar {
  background-color: #03274B !important;
  color: #FFF !important;
}

.toolbar-image {
  margin-top: 10px;
}

.title {
  margin-left: 20px;
}
</style>
