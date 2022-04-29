<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
      </template>

      <v-card>
        <v-card-text style="height: 600px; padding: 0px;">
          <v-card-title class="text-h8 runoff-title">
            Antecedant Moisture
            <v-icon @click="dialog = false" class="close-icon">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="modal-body">
           <p>
                "Variability occurs in the hydrologic response from a precipitation event as the result of rainfall intensity and duration, total rainfall, soil moisture conditions, vegetation cover density and stage of growth, and temperatures (National Resource Conservation Service, 2004).  These factors affecting the hydrologic response are referred to as the Antecedent Runoff Condition (ARC).  The ARC is divided into three classes including Dry, Normal, and Wet and the class selected can have a substantial effect on the hydrologic response.  High temperatures, high vegetation density and cover, and low soil moisture will result in dry conditions.  Low temperatures, low vegetation cover and high soil moisture will result in Wet conditions.  The Normal condition will fall in between these extremes and the selection of the appropriate ARC condition will come with experience and familiarity with the hydroclimatic conditions in the basin. "  
            </p>
            <h2>
                Citations
            </h2>
            <p>
                Natural Resources Conservation Service, 2004, Chapter 10—Estimation of direct runoff from storm rainfall—Part 630 hydrology—National engineering handbook: Washington, D.C., U.S. Department of Agriculture, 22 p. [Also available at https://directives.sc.egov.usda.gov/17752.wba.] 
            </p>
          </v-card-text>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="footer">
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
        dialog: false,
      }
    },
  }
</script>

<style scoped>
.modal-body {
  font-size: 12px !important;
}

.runoff-title {
  color: rgba(0, 0, 0, 0.54);
  font-size: 1em;
}

.footer {
  flex-direction: column;
  background-color: #e0e0e0;
}

.close-btn {
  text-align: center;
}

.close-icon {
    margin-right: 0px;
    margin-left: auto;
}
</style>
