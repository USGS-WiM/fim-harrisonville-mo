<template>
  <v-navigation-drawer v-model="drawerState" app clipped :width="375">
    <div>
      <MapFilters></MapFilters>
    </div>
  </v-navigation-drawer>
</template>

<style>
  @import '../styles/custom.less';
</style>

<script>
// imports
import MapFilters from '../components/MapFilters';

export default {
  name: "NavigationDrawer",
  components: {
    MapFilters
  },
  computed: {
    drawerState: {
      get() {
        return this.$store.getters.drawerState;
      },
      set(v) {
        return this.$store.commit("toggleDrawerState", v);
      },
    },
  },
};
</script>
