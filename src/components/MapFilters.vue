<template>
  <v-expansion-panels v-model="panel" multiple>
    <!-- Basemap Section -->
    <v-expansion-panel>
      <v-expansion-panel-header  :expand-icon="basemapIcon" disable-icon-rotate @click="changeBasemapIcon()"> Basemaps </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="px-0" fluid>
            <v-btn-toggle borderless mandatory>
              <v-btn
                text
                id="streets"
                class="basemapBtn"
                value="Streets"
                @click="basemapSelected = 'Streets'"
              >
                <img
                  class="basemapThumb"
                  alt=""
                  src="../assets/streets.jpg"
                /><label for="streets">Streets</label>
              </v-btn>
              <v-btn
                text
                id="satellite"
                class="basemapBtn"
                value="Satellite"
                @click="basemapSelected = 'Satellite'"
              >
                <img
                  class="basemapThumb"
                  alt=""
                  src="../assets/satellite.jpg"
                /><label for="satellite">Satellite</label>
              </v-btn>
              <v-btn
                text
                id="topo"
                class="basemapBtn"
                value="Topo"
                @click="basemapSelected = 'Topo'"
              >
                <img
                  class="basemapThumb"
                  alt=""
                  src="../assets/topo.jpg"
                /><label for="topo">Topo</label>
              </v-btn>
              <v-btn
                text
                id="natgeo"
                class="basemapBtn"
                value="NatGeo"
                @click="basemapSelected = 'NatGeo'"
              >
                <img
                  class="basemapThumb"
                  alt=""
                  src="../assets/natgeo.jpg"
                /><label for="natgeo">NatGeo</label>
              </v-btn>
            </v-btn-toggle>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    <!-- Filters Section -->
    <v-expansion-panel>
      <v-expansion-panel-header :expand-icon="floodIcon" disable-icon-rotate @click="changeFloodIcon()">
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
            <v-subheader>Precipitation Frequency (years):  &nbsp; {{ frequencyDisplayed }}</v-subheader>
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
        <v-subheader v-if="nullValue">No flood stage available at this duration and frequency.</v-subheader>
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
        // durationValues: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        frequencyDisplayValues: [1, 2, 5, 10, 25, 50, 100, 200, 500, 1000],
        durationSteps: [{0.5: 0.5}, {1: 1}, {1.5: 2}, {2: 3}, {2.5: 4}, {3: 6}, {3.5: 8}, {4: 12}, {4.5: 24}],
        frequencySteps: [{1: "F1YEAR"}, {2: "F2YEAR"}, {3: "F5YEAR"}, {4: "F10YEAR"}, {5: "F25YEAR"}, {6: "F50YEAR"}, {7: "F100YEAR"}, {8: "F200YEAR"}, {9: "F500YEAR"}, {10: "F1000YEAR"}],
        durationStep: 0.5,
        frequencyStep: 1,
        durationMin: 0.5,
        frequencyMin: 1,
        durationMax: 4.5,
        frequencyMax: 9,
        durationTicks: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        frequencyTicks: [1, 2, 5, 10, 25, 50, 100, 200, 500, 1000],
        durationValue: 0.5,
        frequencyValue: "F1YEAR",
        frequencyDisplayed: 1,
        nullValue: true,
        basemapIcon: "mdi-plus",
        floodIcon: "mdi-minus",
      }
    },
    methods: {
      changeBasemapIcon() {
        this.basemapIcon = this.basemapIcon === "mdi-plus" ? "mdi-minus" : "mdi-plus";
      },
      changeFloodIcon() {
        this.floodIcon = this.floodIcon === "mdi-plus" ? "mdi-minus" : "mdi-plus";
      }
    },
    watch: {
      "$store.state.nullValue": function () {
        this.nullValue = this.$store.state.nullValue;
      },
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
                self.$store.commit("getDurationValue", self.durationValue);
              }
            })
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
                self.$store.commit("getFrequencyValue", self.frequencyValue);
                self.frequencyDisplayed = self.frequencyDisplayValues[i];
              }
            })
            return this.$store.commit("getPrecipFrequency", value);
          },
      },
      // use v-model to set basemap state
      basemapSelected: {
        get() {
          return this.$store.state.basemapState;
        },
        set(value) {
          return this.$store.commit("getBasemapState", value);
        },
      },
    }
  }
</script>
<style>
.v-expansion-panel-header {
  font-weight: 700;
}

.sliders {
  font-size: 10px !important;
}

.v-slider--horizontal .v-slider__track-container {
  height: 5px !important;
}

.basemapThumb {
  border: 0.5px solid #ffffff;
  border-radius: 2px;
  margin-right: 15px;
  height: 25px;
}

.basemapBtn {
  width: 100%;
  justify-content: left !important;
  font-weight: 400 !important;
}

.v-btn-toggle {
  flex-direction: column;
  width: 100%;
}

</style>