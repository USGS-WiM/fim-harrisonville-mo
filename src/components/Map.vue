<template>
  <v-main>
    <div style="height: 100%; width: 100%">
      <!-- a leaflet map -->
      <div id="map"></div>
      <!-- Legend -->
      <v-expansion-panels id="legendContainer">
        <v-expansion-panel>
          <!-- Legend title -->
          <v-expansion-panel-header id="titleContainer" @click="getLegends()">
            <div id="legendExplanation">
              <v-icon 
                small
                color="#333"
                >mdi-shape
              </v-icon>
              <label>Explanation</label>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content id="legendContent">
          <!-- Layers (not toggleable) -->
            <div id="layers">
              <div class="legendIcon" v-if="fimAreaVisible">
                <div
                  id="fimAreaIcon"
                ></div>
                <label>Flood-inundation Area</label>
              </div>
              <div class="legendIcon" v-if="precipGageVisible">
                <div
                  id="precipGageIcon"
                  class="wmm-circle wmm-green wmm-icon-noicon wmm-icon-green wmm-size-15"
                ></div>
                <label id="precipGageLabel" v-if="precipGageVisible">Precipitation Gage</label>
              </div>
              <div class="legendIcon" v-if="studyBoundaryVisible">
                <div
                  id="studyBoundaryIcon"
                ></div>
                <label v-if="studyBoundaryVisible">Study Boundary</label>
              </div>
            </div>
            <!-- Toggleable layers -->
            <!-- <div id="toggleableLayers">
            </div> -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-main>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as esri from "esri-leaflet";

//define basemaps
var tileProviders = [
  {
    name: "Streets",
    attribution: "Esri",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Satellite",
    attribution:
      "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Topo",
    attribution: "Esri",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "NatGeo",
    attribution: "Esri",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
  },
];

export default {
  name: "Map",
  data() {
    return {
      map: null,
      zoom: 15,
      tileProviders: {
        "Streets": L.tileLayer(tileProviders[0].url, {attribution: tileProviders[0].attribution, name: tileProviders[0].name}),
        "Satellite": L.tileLayer(tileProviders[1].url, {attribution: tileProviders[1].attribution, name: tileProviders[1].name}),
        "Topo": L.tileLayer(tileProviders[2].url, {attribution: tileProviders[2].attribution, name: tileProviders[2].name}),
        "NatGeo": L.tileLayer(tileProviders[3].url, {attribution: tileProviders[3].attribution, name: tileProviders[3].name}),
      },
      center: L.latLng(38.645, -94.345),
      floodLayer: null,
      fimAreaVisible: true,
      precipGageVisible: true,
      studyBoundaryVisible: true,
      legendLoaded: false,
    };
  },
  methods: {
    createMap() {
      let self = this;

      this.map = L.map("map", {
        center: self.center,
        zoom: self.zoom,
        zoomSnap: 0.5,
        layers: [self.tileProviders["Streets"]]
      });

      this.loadPolygon();
    },
    loadPolygon() {
      let polygonURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Floods/MapServer/0`;

      this.floodLayer = esri.featureLayer({
        url: polygonURL,
      })
    },
    queryTable(duration, frequency) {
      let self = this;
      let tableURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Floods/MapServer/1/query?where=Duration=${duration}&outFields=${frequency}&f=pjson`;

      let httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            self.getPolygon(Object.values(response.features[0].attributes)[0])
        }
      };

      httpRequest.open("GET", tableURL, true);
      httpRequest.send();

    },
    getPolygon(value) {
      if(value !== null){
        this.$store.state.nullValue = false;
        this.floodLayer.setWhere(`STAGE=${value}`)
        this.floodLayer.addTo(this.map);
        this.fimAreaVisible = true;
      }else{
        this.$store.state.nullValue = true;
        if(this.map.hasLayer(this.floodLayer)){
          this.floodLayer.remove();
        }
        this.fimAreaVisible = false;
      }
    },
    // Compare tile provider name to basemap state and add to map
    selectBasemap() {
      let self = this;
      //Clear all basemaps before adding
      self.map.eachLayer(function (layer) {
        if (layer instanceof L.TileLayer) {
          layer.remove();
        }
      });
      for (let i = 0; i < tileProviders.length; i++) {
        if (self.$store.state.basemapState == tileProviders[i].name) {
          let attribution = tileProviders[i].attribution;
          L.tileLayer(tileProviders[i].url, {
            attribution: attribution,
          }).addTo(self.map);
        }
      }
    },
    getLegends() {
      if(!this.legendLoaded){
        this.getFloodPolyLegend();
        this.getStudyBoundaryLegend();
      }
      this.legendLoaded = true;
    },
    getFloodPolyLegend() {
      // Add flood poly legend image for layer from map service
        let legendURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Floods_v2/MapServer/legend?f=pjson`;

        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              let response = JSON.parse(this.responseText);
              let floodPolyDiv = document.getElementById("fimAreaIcon");
              response.layers.forEach(function(layer){
                if(layer.layerName === "FloodPolys"){
                  floodPolyDiv.innerHTML =
                      "<img src=data:" +
                      layer.legend[0].contentType +
                      ";base64," +
                      layer.legend[0].imageData +
                      " alt=''/>"
                }
              })
          }
        };

        httpRequest.open("GET", legendURL, true);
        httpRequest.send();
    },
    getStudyBoundaryLegend() {
      // Add legend images for layers from map service
        let legendURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Floods_v2/MapServer/legend?f=pjson`;

        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              let response = JSON.parse(this.responseText);
              let studyBoundaryDiv = document.getElementById("studyBoundaryIcon");
              response.layers.forEach(function(layer){
                if(layer.layerName === "MudharMO_studybounds"){
                  studyBoundaryDiv.innerHTML =
                      "<img src=data:" +
                      layer.legend[0].contentType +
                      ";base64," +
                      layer.legend[0].imageData +
                      " alt=''/>"
                }
              })
          }
        };

        httpRequest.open("GET", legendURL, true);
        httpRequest.send();
    }
  },
  mounted() {
    this.createMap();
  },
  watch: {
    "$store.state.durationValue": function () {
      this.queryTable(this.$store.state.durationValue, this.$store.state.frequencyValue);
    },
    "$store.state.frequencyValue": function () {
      this.queryTable(this.$store.state.durationValue, this.$store.state.frequencyValue);
    },
    // Watch basemap state and update visibility when state changes
    "$store.state.basemapState": function () {
      this.selectBasemap();
    },
    // Update the legend from wms when layer is added using slider
    "$store.state.nullValue": function () {
      if(!this.$store.state.nullValue){
        this.legendLoaded = false;
        this.getFloodPolyLegend();
        this.legendLoaded = true;
      }
    },
  },
};
</script>
<style>
  @import "../styles/markers.css";
  #map {
    height: 100%;
    width: 100%;
    font-family: "Public Sans", sans-serif;
    /* Set z-index so sidebar appears above map on mobile */
    z-index: 1;
  }

  #legendContainer {
    border-radius: 5px 5px 5px 5px;
    box-shadow: 0 3px 6px rgba(30, 39, 50, 0.2), 0 3px 6px rgba(30, 39, 50, 0.2);
    right: 10px;
    top: 45px;
    height: auto;
    width: 225px;
    position: absolute;
    z-index: 999;
    font-size: 14px;
    opacity: 0.75;
  }

  #legendExplanation {
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
  }

  #legendExplanation label {
    padding-left: 5px;
    font-family: "Public Sans", sans-serif;
  }

  #legendContent {
    max-height: 65vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .legendIcon {
    display: flex;
    position: relative;
    margin: 8px;
  }

  .legendIcon div {
    vertical-align: middle;
    margin-left: 0px !important; 
    padding-right: 20px;
  }

  .legendIcon img {
    vertical-align: middle;
  }

  #precipGageLabel {
    padding-left: 40px;
  }

  .legendIcon label {
    display: inline-block;
    -webkit-justify-content: center;
    justify-content: center;
    font-family: "Public Sans", sans-serif;
  }
</style>
