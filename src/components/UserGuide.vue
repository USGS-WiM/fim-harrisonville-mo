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
          <v-icon small class="header-icons">mdi-book-open-variant</v-icon>User Guide
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h8 grey lighten-2 user-guide-title">
          <v-icon class="header-icons">mdi-book-open-variant</v-icon>User Guide
          <v-icon @click="dialog = false" class="close-icon">mdi-close</v-icon>
        </v-card-title>

        <v-card-text  style="height: 600px; padding: 0px;">
          Text to be provided.
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

.header-icons {
    margin-right: 5px;
}

.user-guide-title {
  color: rgba(0, 0, 0, 0.54);
  font-size: 1em !important;
}

.footer {
  background-color: #e0e0e0;
  flex-direction: column;
}

.close-btn {
  text-align: center;
}
</style>
