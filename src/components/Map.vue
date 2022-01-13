<template>
  <v-main>
    <div style="height: 100%; width: 100%">
      <!-- a leaflet map -->
      <div id="map"></div>
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
    name: "Terrain",
    attribution: "Esri, NAVTEQ, DeLorme",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Gray",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri, NAVTEQ, DeLorme",
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
      tileProviders: tileProviders,
      center: L.latLng(38.645, -94.345),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      floodLayer: null,
    };
  },
  methods: {
    createMap() {
      let self = this;
      this.map = L.map("map", {
        center: self.center,
        zoom: self.zoom,
        zoomSnap: 0.5,
      });

      //Add streets tilelayer to map initially
      L.tileLayer(tileProviders[0].url, {
        attribution: tileProviders[0].attribution,
        name: tileProviders[0].name,
      }).addTo(self.map);

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
      }else{
        this.$store.state.nullValue = true;
        if(this.map.hasLayer(this.floodLayer)){
          this.floodLayer.remove();
        }
      }
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
  },
};
</script>
<style>
  #map {
    height: 100%;
    width: 100%;
    font-family: "Public Sans", sans-serif;
    /* Set z-index so sidebar appears above map on mobile */
    z-index: 1;
  }
</style>
