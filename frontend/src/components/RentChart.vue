<template>
  <div>
    <ApexChart v-if="ready" :options="chartOptions" :series="series"></ApexChart>
  </div>    
</template>
  
<script>
import ApexChart from 'vue3-apexcharts'

export default {
    name: 'RentChart',
    components: { ApexChart },
    data() {
        return {
            ready: false,
            chartOptions: {
                chart: { type: 'bar' },
                labels: [],
                fill: { type: 'gradient' }
            },
            series: [
              { name: 'Cars', data: [] }
            ]
        }
    },
    mounted() {
      fetch("/rent?limit=1000", {
      method: "GET",
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            const groupedCars = data.reduce((acc, rent) => {
              const { carName } = rent;
              if (!acc[carName]) {
                acc[carName] = {
                  count: 1,
                  rents: [rent],
                };
              } else {
                acc[carName].count++;
                acc[carName].rents.push(rent);
              }

              return acc;
            }, {});

            const resultArray = Object.entries(groupedCars).map(
              ([carName, data]) => ({
                carName,
                count: data.count,
                rents: data.rents,
              })
            );
            this.series[0].data = resultArray.map((result) => result.count);
            this.chartOptions.labels = resultArray.map(
              (result) => result.carName
            );
            this.ready = true;
          })
          .catch((err) => console.error(err.message));
      })
      .catch((err) => console.error(err.message));
  },
}
</script>