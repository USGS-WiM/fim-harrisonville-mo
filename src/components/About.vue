<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
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
          <v-icon small class="header-icons">mdi-help-circle-outline</v-icon> About
        </v-btn>
      </template>

      <v-card>
          <v-tabs
            background-color="grey lighten-2"
            centered
          >
            <v-tab>
              <v-icon class="header-icons">mdi-help-circle-outline</v-icon>About the application
            </v-tab>
            <v-tab>
              <v-icon class="header-icons">mdi-exclamation</v-icon>Welcome and Disclaimer
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <p>About information to be provided</p>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <p>Disclaimer to be provided</p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
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
        // tab: null,
        // text: "To be provided",
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

.about-btn {
    background-color:  #03274B !important;
    text-transform: capitalize;
}

.header-icons {
    margin-right: 5px;
}

.v-tab {
font-size: 0.75em
}
</style>
