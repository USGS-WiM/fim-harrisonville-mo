<template>
  <v-expansion-panels v-model="panel" multiple>
    <!-- Basemap Section -->
    <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate> Basemaps </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container class="px-0" fluid>
            <v-btn-toggle borderless mandatory v-model="basemapSelected" class="basemapGroup">
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
      <v-expansion-panel-header disable-icon-rotate>
        Flood Scenarios
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container class="px-0" fluid>
          <v-card class="sub-card" flat>
            <v-card-text>
              <div class="moistureButtonDiv">
                <v-subheader>Select an antecedant moisture condition:</v-subheader>
                <div class="button-row">
                  <v-btn-toggle mandatory v-model="moistureSelected" class="moistureGroup">
                    <v-btn
                      id="dry"
                      class="moistureBtn"
                      value="Dry"
                      elevation="1"
                      @click="moistureSelected = 'Dry'"
                    >Dry
                    </v-btn>
                    <v-btn
                      id="normal"
                      class="moistureBtn"
                      value="Normal"
                      elevation="1"
                      @click="moistureSelected = 'Normal'"
                    >Normal
                    </v-btn>
                    <v-btn
                      id="wet"
                      class="moistureBtn"
                      value="Wet"
                      elevation="1"
                      @click="moistureSelected = 'Wet'"
                    >Wet
                    </v-btn>
                  </v-btn-toggle>
                  <RunoffModal></RunoffModal>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <v-card class="sub-card" flat>
            <v-card-text>
              <v-subheader>Select a precipitation duration (hours):  &nbsp; <span class="slider-values">{{durationValue}}</span></v-subheader>
              <v-slider
                class="sliders"
                v-model="precipDuration"
                :step="durationStep"
                ticks
                :tick-labels="durationTicks"
                tick-size="4"
                max="4.5"
                min="0.5"
                type="number"
              >
              </v-slider>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
          <v-card class="sub-card" flat>
            <v-card-text>
              <v-subheader>Select a precipitation magnitude (inches):  &nbsp; <span class="slider-values">{{ magnitudeDisplayed }}</span></v-subheader>
              <v-slider
                class="sliders"
                v-model="precipMagnitude"
                :step="magnitudeStep"
                type="number"
                ticks
                :tick-labels="magnitudeTicks"
                tick-size="4"
                max="10"
                min="1"
              >
              </v-slider>
            </v-card-text>
          </v-card>
        </v-container>
        <v-alert
          type="warning"
          dense
          text
          v-if="nullValue"
        >
          No flood stage available at this duration and magnitude.
        </v-alert>
        <v-alert
          type="warning"
          dense
          text
          v-if="noChange"
        >
          No change in flood stage between the current and previously selected magnitude, duration, and moisture values.
        </v-alert>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <NWISTable></NWISTable>
  </v-expansion-panels>
</template>

<script>
  import RunoffModal from '../components/RunoffModal';
  import NWISTable from '../components/NWISTable';

  export default {
    components: {
      RunoffModal,
      NWISTable
    },
    data () {
      return {
        checkbox: true,
        panel: [1],
        magnitudeDisplayValues: [],
        durationSteps: [{0.5: 0.5}, {1: 1}, {1.5: 2}, {2: 3}, {2.5: 4}, {3: 6}, {3.5: 8}, {4: 12}, {4.5: 24}],
        magnitudeSteps: [],
        durationStep: 0.5,
        magnitudeStep: 1,
        durationMin: 0.5,
        magnitudeMin: 1,
        durationMax: 4.5,
        magnitudeMax: 10,
        durationTicks: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        magnitudeTicks: [],
        durationValue: 24,
        magnitudeValue: 13.1,
        magnitudeDisplayed: 13.1,
        currentMagnitudeIndex: 10,
        nullValue: false,
        noChange: false,
        durationChangedFromTable: false,
        magnitudeFromTable: null,
      }
    },
    methods: {
    changeMagnitude() {
        let self = this;
        let tableURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Floods_v2/MapServer/3/query?where=Duration=${this.durationValue}&outFields=Magnitude&f=pjson`;
        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              let response = JSON.parse(this.responseText);
              self.magnitudeTicks = response.features.map(i => {return i.attributes.Magnitude});
              self.magnitudeDisplayValues = self.magnitudeTicks;
              let index = 0;
              // Get closest magnitude display value for current value
              if(self.durationChangedFromTable){
                self.magnitudeValue = self.magnitudeDisplayValues.reduce((a, b) => Math.abs(b - self.magnitudeFromTable) < Math.abs(a - self.magnitudeFromTable) ? b : a);
                self.magnitudeDisplayed = self.magnitudeValue;
                self.magnitudeSteps = response.features.map((i) => {index ++; return {[index]: i.attributes.Magnitude}});
                let magnitudeArray = JSON.parse(JSON.stringify(self.magnitudeSteps));
                magnitudeArray.forEach(function(obj) {
                  let key = Object.keys(obj);
                  let value = Object.values(obj)
                  if(Number(value) === self.magnitudeValue){
                    self.currentMagnitudeIndex = Number(key);
                  }
                })
                self.precipMagnitude = self.currentMagnitudeIndex;
              }else{
                self.magnitudeSteps = response.features.map((i) => {index ++; return {[index]: i.attributes.Magnitude}});
                self.precipMagnitude = self.currentMagnitudeIndex;
              }
              // Reset this to false
              self.durationChangedFromTable = false;
          }
        };

        httpRequest.open("GET", tableURL, true);
        httpRequest.send();
      }
    },
    watch: {
      "$store.state.nullValue": function () {
        this.nullValue = this.$store.state.nullValue;
      },
      "$store.state.noChangeValue": function () {
        this.noChange = this.$store.state.noChangeValue;
      },
      "$store.state.durationValue": function () {
        let self = this;
        // Watch for value changes from NWIS table
        this.durationValue = this.$store.state.durationValue;
        this.durationChangedFromTable = true;
        // Get the duration index that matches the value to change the slider
        let durationIndex;
        this.durationSteps.forEach(function(step) {
          Object.keys(step).forEach(function(key) {
            if(step[key] === self.durationValue){
              durationIndex = key;
            }
          });
        });
        // ChangeMagnitude will be called when this is changed
        this.$store.commit("getPrecipDuration", durationIndex);
      },
      "$store.state.magnitudeValue": function () {
        // Watch for value changes from NWIS table
        this.magnitudeFromTable = this.$store.state.magnitudeValue;
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
                // Change magnitude options
                self.changeMagnitude();
              }
            })
            this.$store.commit("getPrecipDuration", value);
          },
      },
      precipMagnitude: {
          get() {
            return this.$store.state.precipMagnitude;
          },
          set(value) {
            let self = this;
            let magnitudeArray = JSON.parse(JSON.stringify(this.magnitudeSteps));
            magnitudeArray.forEach(function(obj, i) {
              let key = Object.keys(obj);
              if(Number(key) === value){
                self.magnitudeValue = magnitudeArray[i][key];
                self.$store.commit("getMagnitudeValue", self.magnitudeValue);
                self.magnitudeDisplayed = self.magnitudeDisplayValues[i];
                self.currentMagnitudeIndex = value;
              }
            })
            this.$store.commit("getPrecipMagnitude", value);
          },
      },
      // use v-model to set basemap state
      basemapSelected: {
        get() {
          return this.$store.state.basemapState;
        },
        set(value) {
          this.$store.commit("getBasemapState", value);
        },
      },
      // use v-model to set moisture state
      moistureSelected: {
        get() {
          return this.$store.state.moistureState;
        },
        set(value) {
          this.$store.commit("getMoistureState", value);
        },
      },
    },
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

.slider-values {
  padding-left: 5px;
  font-weight: bold;
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

.basemapGroup {
  flex-direction: column;
  width: 100%;
}

.button-row {
  display: inline-flex;
  width: 100%;
  height: 48px;
  line-height: 48px;
}

.moistureBtn {
  width: 33%;
}

.moistureGroup {
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  margin-right: 10px;
}

.moistureButtonDiv {
  width: 100%;
}
</style>