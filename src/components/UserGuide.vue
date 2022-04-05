<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
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
          <v-icon small class="header-icons">mdi-book-open-variant</v-icon>User Guide
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h6 grey lighten-2 user-guide-title">
          <v-icon class="header-icons">mdi-book-open-variant</v-icon>User Guide
        </v-card-title>

        <v-card-text>
          Text to be provided.
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

.user-guide-btn {
    background-color:  #03274B !important;
    text-transform: capitalize;
}

.header-icons {
    margin-right: 5px;
}

.user-guide-title {
  color: rgba(0, 0, 0, 0.54);
}
</style>
