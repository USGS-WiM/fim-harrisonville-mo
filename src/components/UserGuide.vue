<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="user-guide-btn"
          color="white"
          dark
          elevation="0"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small class="header-icon">mdi-book-open-variant</v-icon>User Guide
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="user-guide-title">Map Interface User Guide
          <v-icon @click="dialog = false" class="close-icon">mdi-close</v-icon>
        </v-card-title>

        <v-card-text  style="height: 600px; padding: 0px;">
          <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="layersTabPane">
						<!-- Accordion Example -->
						<!-- <div class="user-guide-entry" tabindex="1">
							<b>Title</b>
                            <p>Body</p>
							<div class="user-guide-entry-image"><img src="images/userguide/search.png"/></div>
						</div> -->
                        <span class="user-guide-header">Navigation & Map Selection</span>

                        <div class="user-guide-item">
                            <p><b>Zooming</b>The scroll wheel on the mouse can be used to control zooming. In the upper left area of the map interface are "+" and "-" icons; these can also be used to zoom in and out, respectively.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/zoom.png"/></div>
						</div>
						<div class="user-guide-item">
                            <p><b>Explanation display</b>The Explanation box can be collapsed to display more of the mapped area.<br/><br/></p>
							<div class="user-guide-item-image"><img src="../images/userguide/explanation.png"/></div>
						</div>
                        <div class="user-guide-item">
                            <p><b>Using the Explanation</b>The expanded Explanation box explains the symbols, patterns, and colors of the visible data layers on the map.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/explanation_enlarged.png"/></div>
						</div>
                        <div class="user-guide-item">
                            <p><b>Mobile Sidebar</b>On mobile devices, additional basemap and map layer selection option can be accessed by clicking on the 3-line icon which is shown in the most upper left corner of the map interface.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/mobile_menu.png"/></div>
						</div>
                        <div class="user-guide-item">
                            <p><b>Basemaps</b>The "Basemaps" sidebar allows a user to choose and show various geographic information or landscape imagery as a background layer beneath the flood map layers.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/basemaps.png"/></div>
						</div>
                        <div class="user-guide-item">
                            <p><b>Flood Scenarios - Antecedant Moisture Condition</b>The "Antecedant Moisture Condition buttons" sidebar allows a user to select varying moisture conditions of the soil.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/moisturecondition.png"/></div>
						</div>
                        <div class="user-guide-item">
							<p><b>Flood Scenarios - Precipitation Duration</b>The Precipitation Duration Slider allows the user to select a period of precipitation time and see the corresponding flood extent.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/precip_duration.png"/></div>
                        </div>
                        <div class="user-guide-item">
							<p><b>Flood Scenarios - Precipitation Magnitude</b>The Precipitation Magnitude Slider allows the user to select an amount of precipitation and see the corresponding flood extent.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/precip_magnitude.png"/></div>
                        </div>                        
                        <div class="user-guide-item">
							<p><b>Water Depth</b>Click in the inundated area to display estimated water depths.<br/><br/></p>
							<div class="user-guide-item-image"><img src="../images/userguide/waterdepth.png"/></div>
                        </div>
                        <div class="user-guide-item">
                            <p><b>Recent Precipitation Conditions</b>The "Recent Precipitation Conditions" sidebar allows a user to select and highlight specic areas that recently recieved precipitation.</p>
							<div class="user-guide-item-image"><img src="../images/userguide/recent_precip.png"/></div>                        
                    </div>
                </div>
          </div>      
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="footer">

                
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="dialog = false"
            class="close-btn"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<!-- User Guide Modal -->
<div id="userGuideModal" class="modal fade"  tabindex="-1" role="dialog"></div>
    <div class="modal-dialog  modal-md"></div>
        <div class="modal-content"></div>
            <div class="modal-header"></div>
            
            <div id="aboutModalBody" class="modal-body"></div>



<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>

<style scoped>
.text-center {
    margin-left: auto;
    margin-right: 0px;
    font-family: "Public Sans", sans-serif;
}

.user-guide-btn {
    background-color:  #03274B !important;
    text-transform: capitalize;
}

.close-icon {
    margin-right: 0px;
    margin-left: auto;
}

.header-icon {
            font-size: 16px;
            display: inline-block;
            flex-grow: 3;
            padding-left: 1px;
}
.user-guide-title {
                    font-size: 16px;
                    font-weight: 900;
                    font-family: 'Open Sans', sans-serif;
                    color: #030604;
                    letter-spacing: -0.2px;
                    margin-left: -10px;
                }

.footer {
  background-color: #e0e0e0;
  flex-direction: column;
}

.close-btn {
  text-align: center;
}
/*User Guide Modal*/
.user-guide-header {
  display: block;
  font-size: 18px;
  text-align: left;
  box-sizing: border-box;
  padding: 0 0 8px 0;
  font-weight: 700;
  margin-left: 15px;
  color: rgba(16, 21, 44, 0.9);
}
.user-guide-item {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 0 0 0;
  min-height: 100px;
  margin-left: 15px;
  margin-right: 15px;
  height: fit-content;
}
.user-guide-item .user-guide-item-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: fit-content;
  width: fit-content;
}
.user-guide-item .user-guide-item-image img {
  display: block;
  height: 100%;
  width: auto;
  max-height: 80px;
  max-width: 128px;
  min-width: 128px !important;
  border: 2px solid rgba(16, 21, 44, 0.2);
}
.user-guide-item p {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-flex-grow: 2;
  color: rgba(16, 21, 44, 0.5);
  flex-grow: 2;
  box-sizing: border-box;
  font-size: 12pt;
  line-height: 20px !important;
  padding: 6px 15px 6px 0 !important;
}
.user-guide-item p b {
  color: rgba(16, 21, 44, 0.9);
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  font-weight: bolder;
}

</style>