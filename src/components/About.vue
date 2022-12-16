<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="about-btn"
          color="white"
          dark
          elevation="0"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small class="header-icons">mdi-help-circle-outline</v-icon>About
        </v-btn>
      </template>

      <v-card>
        <v-card-text style="height: 600px; padding: 0px;">
          <v-card-title class="text-h8 about-title">
            Muddy Creek at Harrisonville Precipitation-Driven Flood Inundation Mapper
            <v-icon @click="dialog = false" class="close-icon">mdi-close</v-icon>
          </v-card-title>
          <v-tabs
            background-color="grey lighten-2"
            centered
            v-model="selectedTab"
          >
            <v-tab href="#About">
              <v-icon class="header-icons">mdi-help-circle-outline</v-icon>About the application
            </v-tab>
            <v-tab href="#Disclaimer">
              <v-icon class="header-icons">mdi-exclamation</v-icon>Welcome and Disclaimer
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="selectedTab">
            <v-tab-item value="About">
              <v-card flat>
                <v-card-text class="modal-body">
                  <p>
                    The U.S. Geological Survey (USGS), in cooperation with the City of Harrisonville, Missouri, assessed flooding of Muddy Creek resulting from varying precipitation magnitudes and durations, antecedent soil moisture conditions, and channel conditions. The precipitation scenarios were used to develop a library of flood-inundation maps that included a 3.8-mile reach of Muddy Creek and tributaries within and adjacent to the city.
                  </p>
                  <p>
                    Hydrologic and hydraulic models of the upper Muddy Creek Basin were used to assess streamflow magnitudes associated with simulated precipitation amounts and the resulting flood-inundation conditions. The U.S. Army Corps of Engineers Hydrologic Engineering Center-Hydrologic Modeling System (HEC–HMS; version 4.4.1) was used to simulate the amount of streamflow produced from a range of rainfall events. The Hydrologic Engineering Center-River Analysis System (HEC–RAS; version 5.0.7) was then used to route streamflows and map resulting areas of flood inundation.
                  </p>
                  <p>
                    The hydrologic and hydraulic models were calibrated to the September 28, 2019; May 27, 2021; and June 25, 2021, runoff events representing a range of antecedent moisture conditions and hydrologic responses. The calibrated HEC–HMS model was used to simulate streamflows from design rainfall events of 30-minutes to 24-hour durations and ranging from a 100- to 0.1-percent annual exceedance probability. Flood-inundation maps were produced for reference stages of 1.0 feet (ft), or near bankfull, to 4.0 ft, or a stage exceeding the 0.1-percent annual exceedance probability interval precipitation, using the HEC–RAS model. The consequence of each precipitation duration-frequency value was represented by a 0.5-ft increment inundation map based on the generated peak streamflow from that rainfall event and the corresponding stage at the Muddy Creek reference location.
                  </p>
                  <p>
                    Seven scenarios were developed with the HEC–HMS hydrologic model with resulting streamflows routed in a HEC-RAS hydraulic model and these scenarios varied by antecedent soil-moisture and channel conditions. The same precipitation scenarios were used in each of the seven antecedent moisture and channel conditions and the simulation results were assigned to a flood-inundation map condition based on the generated peak flow and corresponding stage at the Muddy Creek reference location.
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item value="Disclaimer">
              <v-card flat>
                <v-card-text class="modal-body">
                  <div id="links">
                    <v-btn class="link-btn" color="primary">
                      <a class="link" href="https://waterdata.usgs.gov/mo/nwis/uv/?site_no=383843094205501" target="_blank">View Site on NWIS</a>
                    </v-btn>
                    <v-btn class="link-btn" color="primary">
                      <a class="link" href="https://accounts.waterdata.usgs.gov/wateralert/my-alerts/#siteNumber=383843094205501" target="_blank">Subscribe to WaterAlert!</a>
                    </v-btn>
                  </div>
                  <h2>
                    Citations
                  </h2>
                  <h4>
                    SIR
                  </h4>
                  <p>Heimann, D.C. and Rydlund, P.H. Jr., 2022, Precipitation-Driven Flood-Inundation Mapping of Muddy Creek at Harrisonville, Missouri: U.S. Geological Survey Scientific Investigations Report 2022-5084, 18 p. 
                    <a href="https://doi.org/10.3133/sir20225084" target="_blank">https://doi.org/10.3133/sir20225084</a>
                  </p>
                  <h4>
                    ScienceBase Data Release
                  </h4>
                  <p>
                    Heimann, D.C., Geospatial data and model archives associated with precipitation-driven flood-inundation mapping of Muddy Creek at Harrisonville, Missouri: U.S. Geological Survey data release.
                    <a href="http://dx.doi.org/10.5066/P969ZOLB" target="_blank">http://dx.doi.org/10.5066/P969ZOLB</a>
                  </p>
                  <h2>
                    Disclaimer for Flood-Inundation Maps
                  </h2>
                  <p>
                    Inundated areas shown should not be used for navigation, regulatory, permitting, or other legal purposes. Although USGS intends to make this server available 24 hours a day, 7 days a week, timely delivery of data and products from this server through the Internet is not guaranteed. The USGS provides these maps “as-is” for a quick reference, emergency planning tool but assumes no legal liability or responsibility resulting from the use of this information.
                  </p>
                  <h2>
                    USGS Data Disclaimer
                  </h2>
                  <p>
                    Unless otherwise stated, all data, metadata and related materials are considered to satisfy the quality standards relative to the purpose for which the data were collected. Although these data and associated metadata have been reviewed for accuracy and completeness and approved for release by the U.S. Geological Survey (USGS), no warranty expressed or implied is made regarding the display or utility of the data for other purposes, nor on all computer systems, nor shall the act of distribution constitute any such warranty.
                  </p>
                  <h2>
                    USGS Software Disclaimer
                  </h2>
                  <p>
                    This software has been approved for release by the U.S. Geological Survey (USGS). Although the software has been subjected to rigorous review, the USGS reserves the right to update the software as needed pursuant to further analysis and review. No warranty, expressed or implied, is made by the USGS or the U.S. Government as to the functionality of the software and related material nor shall the fact of release constitute any such warranty. Furthermore, the software is released on condition that neither the USGS nor the U.S. Government shall be held liable for any damages resulting from its authorized or unauthorized use.
                  </p>
                  <h2>
                    USGS Disclaimer
                  </h2>
                  <p>
                    Any use of trade, firm, or product names is for descriptive purposes only and does not imply endorsement by the U.S. Government.
                  </p>
                  <div id="logos">
                    <img
                      class="harrisonville-logo"
                      alt=""
                      src="../assets/Harrisonville_logo.jpg"
                    />
                    <img
                      class="usgs-logo"
                      alt=""
                      src="../assets/usgs-logo-sm.png"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="footer">
          <!-- Contact -->
          <div class="contact">
            For more information about this web application please contact <a href="https://wim.usgs.gov" target="_blank"><img src="../assets/wim_abbr_black.png"></a>
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-btn
              color="primary"
              @click="dialog = false"
              class="close-btn"
            >
              Close
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // Display dialog with disclaimer tab active on load
        dialog: true,
        selectedTab: "Disclaimer",
      }
    },
    watch: {
      dialog: function() {
        // After modal displays on load, default tab should be About
        this.selectedTab = "About"
      }

    }
  }
</script>

<style scoped>
.modal-body {
  font-size: 12px !important;
}

.text-center {
    margin-left: auto;
    margin-right: 0px;
    font-family: "Public Sans", sans-serif;
}

.about-title {
  color: rgba(0, 0, 0, 0.54);
  font-size: 1em;
}

.about-btn {
    background-color:  #03274B !important;
    text-transform: capitalize;
}

.header-icons {
    margin-right: 5px;
}

.close-icon {
    margin-right: 0px;
    margin-left: auto;
}

.v-tab {
  font-size: 1em;
}

#links {
  margin-bottom: 10px;
  text-align: center;
}

.link-btn {
  margin-bottom: 10px;
  margin-right: 10px;
  text-transform: none;
}

.link {
  color: #FFF !important;
  text-decoration: none;
}

.harrisonville-logo {
  height: 15px;
  vertical-align: middle;
}

.usgs-logo {
  height: 20px;
  margin-left: 10px;
  vertical-align: middle;
}

#logos {
  margin: 10px;
  height: 25px;
}

.footer {
  flex-direction: column;
  background-color: #e0e0e0;
}

.contact {
  text-align: center;
  font-size: 12px;
  padding-bottom: 10px;
}

.contact img {
  height: 16px;
  vertical-align: middle;
  margin-left: 3px;
}

.close-btn {
  text-align: center;
}
</style>
