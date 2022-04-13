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
      depthgridLayer: null,
      floodStageDict: [{1: 0}, {1.5: 1}, {2: 2}, {2.5: 3}, {3: 4}, {3.5: 5}, {4: 6}],
      selectedDepthGrid: 6,
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
      // Remove depth grid layer before adding a new one
      if(this.map.hasLayer(this.depthgridLayer)){
          this.map.removeLayer(this.depthgridLayer);
      }
      // Remove flood poly layer before adding a new one
      if(this.map.hasLayer(this.floodLayer)){
          this.floodLayer.remove();
      }
      if(value !== null){
        this.$store.state.nullValue = false;
        this.floodLayer.setWhere(`STAGE=${value}`)
        this.floodLayer.addTo(this.map);

        // Add depth grid for popup
        let depthgridURL = `https://fim.wim.usgs.gov/server/rest/services/FIM_MO/Depth_Grids/MapServer`;

        let self = this;
        let floodStages = JSON.parse(JSON.stringify(this.floodStageDict));
        floodStages.forEach(function(obj, i) {
          let key = Object.keys(obj);
          if(Number(key) === value){
            self.selectedDepthGrid = floodStages[i][value];
          }
        })

        this.depthgridLayer = esri.dynamicMapLayer({
          url: depthgridURL,
          layers: [this.selectedDepthGrid],
          f: "image",
          opacity: 0,
        })

        this.depthgridLayer.bindPopup(function (error, featureCollection) {
          if (error || featureCollection.features.length === 0) {
            return false;
          } else {
            if(featureCollection.features[0].properties["Pixel Value"] !== 'NoData'){
              return L.Util.template('<h3 class="popup">Water Depth</h3>' + featureCollection.features[0].properties["Pixel Value"] + ' ft');
            }else{
              return false;
            }
          }
        });

        this.depthgridLayer.addTo(this.map)
      }else{
        this.$store.state.nullValue = true;
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
  #map {
    height: 100%;
    width: 100%;
    font-family: "Public Sans", sans-serif;
    /* Set z-index so sidebar appears above map on mobile */
    z-index: 1;
  }

  .popup {
    font-family: "Public Sans", sans-serif;
  }
</style>
