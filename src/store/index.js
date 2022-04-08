import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawerState: true,
    precipDuration: 0.5,
    precipFrequency: 1,
    frequencyValue: "F1YEAR",
    durationValue: 0.5,
    nullValue: true,
    basemapState: "Streets",
    moistureState: "Normal",
  },
  mutations: {
    toggleDrawerState (state, data) {
      state.drawerState = data
    },
    getPrecipDuration(state, precipDuration) {
      state.precipDuration = precipDuration;
    },
    getPrecipFrequency(state, precipFrequency) {
      state.precipFrequency = precipFrequency;
    },
    getFrequencyValue(state, frequencyValue) {
      state.frequencyValue = frequencyValue;
    },
    getDurationValue(state, durationValue) {
      state.durationValue = durationValue;
    },
    getNullValue(state, nullValue) {
      state.nullValue = nullValue;
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
    precipFrequency: (state) => state.precipFrequency,
    frequencyValue: (state) => state.frequencyValue,
    durationValue: (state) => state.durationValue,
    nullValue: (state) => state.nullValue,
    basemapState: (state) => state.basemapState,
    moistureState: (state) => state.moistureState,
  },
  actions: {
  },
  modules: {
  }
})
