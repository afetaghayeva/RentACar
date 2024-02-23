<template>
  <div>
    <ApexChart v-if="ready" :options="chartOptions" :series="series"></ApexChart>
  </div>    
</template>
  
<script>
import ApexChart from 'vue3-apexcharts'

export default {
    name: 'CarChart',
    components: { ApexChart },
    data() {
        return {
            ready: false,
            chartOptions: {
                chart: { type: 'donut' },
                labels: [],
                fill: { type: 'gradient' }
            },
            series: []
        }
    },
    mounted() {
      fetch("/car?limit=1000", {
      method: "GET",
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            const groupedBrands = data.reduce((acc, car) => {
              const { brandName } = car;

              if (!acc[brandName]) {
                acc[brandName] = {
                  count: 1,
                  cars: [car],
                };
              } else {
                acc[brandName].count++;
                acc[brandName].cars.push(car);
              }

              return acc;
            }, {});

            const resultArray = Object.entries(groupedBrands).map(
              ([brandName, data]) => ({
                brandName,
                count: data.count,
                cars: data.cars,
              })
            );
            this.series= resultArray.map( result=> result.count)
            this.chartOptions.labels = resultArray.map(
              (result) => result.brandName
            );
            this.ready = true;
          })
          .catch((err) => console.error(err.message));
      })
      .catch((err) => console.error(err.message));
  },
}
</script>