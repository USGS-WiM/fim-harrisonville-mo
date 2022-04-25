import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawerState: true,
    precipDuration: 4.5,
    precipMagnitude: 10,
    magnitudeValue: null,
    durationValue: 24,
    nullValue: false,
    noChangeValue: false,
    floodStage: 4.5,
    basemapState: "Topo",
    moistureState: "Normal",
  },
  mutations: {
    toggleDrawerState (state, data) {
      state.drawerState = data
    },
    getPrecipDuration(state, precipDuration) {
      state.precipDuration = precipDuration;
    },
    getPrecipMagnitude(state, precipMagnitude) {
      state.precipMagnitude = precipMagnitude;
    },
    getMagnitudeValue(state, magnitudeValue) {
      state.magnitudeValue = magnitudeValue;
    },
    getDurationValue(state, durationValue) {
      state.durationValue = durationValue;
    },
    getNullValue(state, nullValue) {
      state.nullValue = nullValue;
    },
    getNoChangeValue(state, noChangeValue) {
      state.noChangeValue = noChangeValue;
    },
    getFloodStage(state, floodStage) {
      state.floodStage = floodStage;
    },
    getBasemapState(state, selected) {
      state.basemapState = selected;
    },
    getMoistureState(state, moistureState) {
      state.moistureState = moistureState;
    },
  },
  getters : {
    drawerState: (state) => state.drawerState,
    precipDuration: (state) => state.precipDuration,
    precipMagnitude: (state) => state.precipMagnitude,
    magnitudeValue: (state) => state.magnitudeValue,
    durationValue: (state) => state.durationValue,
    nullValue: (state) => state.nullValue,
    noChangeValue: (state) => state.noChangeValue,
    floodStage: (state) => state.floodStage,
    basemapState: (state) => state.basemapState,
    moistureState: (state) => state.moistureState,
  },
  actions: {
  },
  modules: {
  }
})
