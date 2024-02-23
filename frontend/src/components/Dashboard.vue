<template>
    <v-card variant="text">
        <v-card-title>Dashboard</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <CarChart />
                </v-col>
                <v-col cols="6">
                    <RentChart/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <RentTimelineChart/>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script>
import common from '../mixins/common'

import CarChart from './CarChart.vue'
import RentChart from './RentChart.vue'
import RentTimelineChart from './RentTimelineChart.vue'

export default {
    name: 'DashboardView',
    components: { CarChart, RentChart,RentTimelineChart },
    mixins: [ common ],
    props: [ 'user' ]
}
</script>
  
<style scoped>
</style>