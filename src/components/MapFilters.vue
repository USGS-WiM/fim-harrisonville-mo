<template>
  <v-expansion-panels v-model="panel" multiple>
    <!-- Basemap Section -->
    <v-expansion-panel>
      <v-expansion-panel-header>
        Basemaps
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container class="px-0" fluid>
          <v-checkbox
            v-model="checkbox"
            :label="`Checkbox 1`"
          ></v-checkbox>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!-- Filters Section -->
    <v-expansion-panel>
      <v-expansion-panel-header>
        Flood Scenarios
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container class="px-0" fluid>
          <v-card>
            <v-card-text>
              <v-subheader>Precipitation Duration (hours):  &nbsp; {{durationValue}}</v-subheader>
              <v-slider
                class="sliders"
                v-model="precipDuration"
                :step="durationStep"
                ticks
                :tick-labels="durationTicks"
                tick-size="4"
                :max="4.5"
                :min="0.5"
                type="number"
              >
              </v-slider>
            </v-card-text>
          </v-card>
          <v-card>
          <v-card-text>
            <v-subheader>Precipitation Frequency (years):  &nbsp; {{ frequencyValue }}</v-subheader>
            <v-slider
              class="sliders"
              v-model="precipFrequency"
              :step="frequencyStep"
              type="number"
              ticks
              :tick-labels="frequencyTicks"
              tick-size="4"
              :max="9"
              :min="1"
            >
            </v-slider>
          </v-card-text>
        </v-card>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  export default {
    data () {
      return {
        checkbox: true,
        panel: [1],
        durationValues: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        frequencyValues: [1, 2, 5, 10, 50, 100, 200, 500, 1000],
        durationSteps: [{0.5: 0.5}, {1: 1}, {1.5: 2}, {2: 3}, {2.5: 4}, {3: 6}, {3.5: 8}, {4: 12}, {4.5: 24}],
        frequencySteps: [{1: 1}, {2: 2}, {3: 5}, {4: 10}, {5: 50}, {6: 100}, {7: 200}, {8: 200}, {9: 1000}],
        durationStep: 0.5,
        frequencyStep: 1,
        durationMin: 0.5,
        frequencyMin: 1,
        durationMax: 4.5,
        frequencyMax: 9,
        durationTicks: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        frequencyTicks: [1, 2, 5, 10, 50, 100, 200, 500, 1000],
        durationValue: 0.5,
        frequencyValue: 1,
      }
    },
    methods: {
    },
    computed: {
      precipDuration: {
          get() {
            return this.$store.state.precipDuration;
          },
          set(value) {
            let self = this;
            let durationArray = JSON.parse(JSON.stringify(this.durationSteps));
            durationArray.forEach(function(obj, i) {
              let key = Object.keys(obj);
              if(Number(key) === value){
                self.durationValue = durationArray[i][key];
              }
            })
            this.$store.commit("getDurationValue", value);
            return this.$store.commit("getPrecipDuration", value);
          },
      },
      precipFrequency: {
          get() {
            return this.$store.state.precipFrequency;
          },
          set(value) {
            let self = this;
            let frequencyArray = JSON.parse(JSON.stringify(this.frequencySteps));
            frequencyArray.forEach(function(obj, i) {
              let key = Object.keys(obj);
              if(Number(key) === value){
                self.frequencyValue = frequencyArray[i][key];
              }
            })
            this.$store.commit("getFrequencyValue", value);
            return this.$store.commit("getPrecipFrequency", value);
          },
      },
    }
  }
</script>
<style>
.sliders {
  font-size: 10px !important;
}

.v-slider--horizontal .v-slider__track-container {
  height: 5px !important;
}
</style>