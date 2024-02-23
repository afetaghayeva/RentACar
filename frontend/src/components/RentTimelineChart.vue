<template>
  <div >
    <ApexChart v-if="ready&&series[0].data.length>0" :options="chartOptions" :series="series"></ApexChart>
  </div>
</template>
    
<script>
import ApexChart from 'vue3-apexcharts'

export default {
  name: 'RentTimelineChart',
  components: { ApexChart },
  data() {
    return {
      ready:false,
      chartOptions: {
        chart: {
          height: 200,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          type: 'datetime'
        }
      },
      series: [
        { data: [] }
      ]
    }
  },
  methods: {
    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  },
  mounted() {
    fetch('/rent?limit=10', {
      method: 'GET'
    })
      .then((res) => {
        res.json()
          .then((data) => {
           let result = data.map(rent => {
              let startDate = new Date(rent.rentDate);
              let endDate = this.addDays(startDate, rent.dayCount)
              return {
                x: rent.carName,
                y: [startDate.getTime(), endDate.getTime()]
              }
            });
            console.log(result);
            this.ready=true;
          })
          .catch(err => console.error(err.message))
      })
      .catch(err => console.error(err.message))
  }
}
</script>