<template>
  <v-data-table 
    dense 
    hide-default-footer
    :headers="headers"
    :items="nwisDuration"
    disable-sort>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.duration" @click="selectRow(item)" :class="{'selected': item.isSelected}">
          <td>{{ item.date }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.precip }}</td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'NWISTable',
  data() {
    return {
        headers: [
          { text: 'Precipitation Date/Time (CDT)', value: "date" },
          { text: 'Precipitation Duration (hours)', value: "duration" },
          { text: 'Precipitation Total (inches)', value: "precip" },
        ],
        nwisDuration: [],
        durations: [0.5, 1, 2, 3, 4, 6, 8, 12, 24],
        closestBefore: null,
        closestAfter: null,
        closestBeforePrecip: null,
        closestAfterPrecip: null,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
  },
  methods: {
    // Get instantaeous values from NWIS from most recent 1 day period
    getNWISData(){
        let self = this;
        let nwisURL = `https://nwis.waterservices.usgs.gov/nwis/iv/?format=nwjson&sites=383843094205501&parameterCd=00045&period=P1D`;
        let durationDates = []
        // Make sure time zone is CST/CDT, which is what NWIS is returning for Harrisonville
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
        let formatted_now = `${self.months[now.getMonth()]} ${now.getDate()} at ${now.getHours().toString().length === 1 ? now.getHours().toString().padStart(2, '0') : now.getHours()}:${now.getMinutes().toString().length === 1 ? now.getMinutes().toString().padStart(2, '0') : now.getMinutes()}`
        this.$store.commit("getLastUpdated", formatted_now);
        // Get the dates/times for each duration from now
        this.durations.forEach(duration => {
            let now_copy = new Date(now);
            if(duration !== 0.5){
                durationDates.push({"date": (new Date(now_copy.setHours(now_copy.getHours() - duration))), "duration": duration})
            }else{
                // Need to handle 0.5 with minutes, not hours
                durationDates.push({"date": (new Date(now_copy.setMinutes(now_copy.getMinutes() - 30))), "duration": duration})
            }
        })

        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let initialTimeseries = response.data[1].time_series_data;
            // Find closest date/time in nwis array to each duration from now
            durationDates.forEach(pair => {
                self.closestBefore = null;
                self.closestAfter = null;
                self.closestBeforePrecip = null;
                self.closestAfterPrecip = null;
                self.getClosestDate(initialTimeseries, pair);
            })
            // Get max precipitation value to highlight on map
            let sortedArray = JSON.parse(JSON.stringify(self.nwisDuration.sort((a, b) => b.precip - a.precip)));
            let maxValues = sortedArray[0];
            self.selectRow(maxValues);
          }
        };

        httpRequest.open("GET", nwisURL, true);
        httpRequest.send();
    },
    getClosestDate(initialTimeseries, pair) {
      let self = this;
      let done = false;
        initialTimeseries.forEach(series => {
          let seriesDate = new Date(series[0])
          if(!done){
            if(seriesDate <= pair.date){
              self.closestBefore = seriesDate;
              self.closestBeforePrecip = series[1];
            }else if(seriesDate >= pair.date){
              self.closestAfter = seriesDate;
              self.closestAfterPrecip = series[1];
              if(pair.date - self.closestBefore > self.closestAfter - pair.date){
                self.nwisDuration.push({"date": `${self.months[self.closestAfter.getMonth()]} ${self.closestAfter.getDate()} ${self.closestAfter.getHours().toString().length === 1 ? self.closestAfter.getHours().toString().padStart(2, '0') : self.closestAfter.getHours()}:${self.closestAfter.getMinutes().toString().length === 1 ? self.closestAfter.getMinutes().toString().padStart(2, '0') : self.closestAfter.getMinutes()}`, "duration": pair.duration, "precip": self.closestAfterPrecip, "isSelected": false})
                done = true;
              }else{
                self.nwisDuration.push({"date": `${self.months[self.closestBefore.getMonth()]} ${self.closestBefore.getDate()} ${self.closestBefore.getHours().toString().length === 1 ? self.closestBefore.getHours().toString().padStart(2, '0') : self.closestBefore.getHours()}:${self.closestBefore.getMinutes().toString().length === 1 ? self.closestBefore.getMinutes().toString().padStart(2, '0') : self.closestBefore.getMinutes()}`, "duration": pair.duration, "precip": self.closestBeforePrecip, "isSelected": false})
                done = true;
              }
            }
          }
        });
    },
    selectRow(row) {
      // Reset previsouly selected
      this.nwisDuration.map(item => {item.isSelected = false})
      let index = this.nwisDuration.map(function(a) { return a.duration; }).indexOf(row.duration);
      // Set this row as selected
      this.nwisDuration[index].isSelected = !row.isSelected;
      this.$store.commit("getDurationValue", row.duration);
      this.$store.commit("getMagnitudeValue", row.precip);
    },
    removeAllSelected() {
      // Reset previsouly selected
      this.nwisDuration.map(item => {item.isSelected = false})
      this.$store.commit("getSlidersChanged", false);
    }
  },
  mounted() {
    this.getNWISData();
  },
  watch: {
    "$store.state.slidersChanged": function () {
      if(this.$store.state.slidersChanged){
        this.removeAllSelected();
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.selected {
  font-weight: bold;
  background-color: #cce4f7;
}

tr {
  cursor: pointer;
}
</style>
