<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
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
          <v-icon small class="about-icon">mdi-help-circle-outline</v-icon> About
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <v-icon class="about-icon">mdi-help-circle-outline</v-icon> About
        </v-card-title>

        <v-card-text>
          About text will go here.
        </v-card-text>

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

.about-icon {
    margin-right: 5px;
}
</style>
