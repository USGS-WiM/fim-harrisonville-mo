<template>
  <v-main>
    <div style="height: 100%; width: 100%">
      <!-- a leaflet map -->
      <div id="map"></div>
      <!-- Legend -->
      <v-expansion-panels id="legendContainer">
        <v-expansion-panel>
          <!-- Legend title -->
          <v-expansion-panel-header id="titleContainer">
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
                  style="padding-right: 10px;"
                  id="fimAreaIcon"
                  class="
                    wmm-square wmm-blue wmm-icon-square wmm-icon-blue wmm-size-25 wmm-borderless
                  "
                ></div>
                <label v-if="fimAreaVisible">Flood-inundation Area</label>
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
      fimAreaVisible: false,
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
    display: inline-block;
    position: relative;
    margin: 8px;
    line-height: 24px;
    height: 24px;
  }

  .legendIcon div {
    vertical-align: middle;
    label {
      display: inline-block;
      -webkit-justify-content: center;
      justify-content: center;
      padding-left: 5px;
    }
  }

  .legendIcon label {
    display: inline-block;
    -webkit-justify-content: center;
    justify-content: center;
    padding-left: 20px;
    font-family: "Public Sans", sans-serif;
  }
</style>
