<template>
    <div>
        <v-card style="overflow-y: scroll;height: 500px;">
            <v-card-title>{{ id ? 'Edit' : 'Create' }} rent</v-card-title>
            <v-card-text>
                <v-form v-model="isRentValid">
                    <v-text-field variant="solo" label="Description" v-model="rent.description"
                        :rules="[rules.required]"></v-text-field>
                    <v-text-field variant="solo" type="date" label="Rent date" v-model="rent.rentDate"
                        :rules="[rules.validStartDate]"></v-text-field>
                    <v-text-field variant="solo" type="number" label="Day count" v-model="rent.dayCount"
                        :rules="[rules.required]"></v-text-field>
                    <v-select v-model="rent.carName" label="Cars"
                        :items="cars.map(car => ({ value: car.name, title: car.name }))" chips>
                    </v-select>
                    <div class="flex-container">
                        <v-btn variant="text" size="xx-small" rounded="false" icon="mdi-image-filter-center-focus"
                            @click="centerView"></v-btn>
                        Location (click or drag to set)
                    </div>
                    <VMap ref="vmap" style="height: 200px;" :center="center" zoom="15" @click="setMarker">
                        <VMapIconMarker ref="vmarker" v-model:latlng="rent.coords"
                            :icon-url="require('leaflet/dist/images/marker-icon.png')"
                            :icon-retina-url="require('leaflet/dist/images/marker-icon-2x.png')"
                            :icon-shadow-url="require('leaflet/dist/images/marker-shadow.png')" :icon-size="[28, 46]"
                            :icon-anchor="[17, 46]" draggable></VMapIconMarker>
                        <VMapGoogleTileLayer />
                        <VMapZoomControl />
                    </VMap>

                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="elevated" color="success" @click="add(user)" :disabled="!isRentValid" v-if="!id">Add</v-btn>
                <v-btn variant="elevated" color="success" @click="modify" :disabled="!isRentValid" v-if="id">Modify</v-btn>
                <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
                <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="confirmation" width="auto">
            <ConfirmationDialog :question="'Are you sure to delete \'' + rent.description + '\' ?'" @ok="removeReal"
                @cancel="confirmation = false" />
        </v-dialog>
    </div>
</template>
  
<script>
import 'leaflet/dist/leaflet.css'
import 'vue-map-ui/dist/normalize.css'
import 'vue-map-ui/dist/style.css'
import 'vue-map-ui/dist/theme-all.css'

import { VMap, VMapGoogleTileLayer, VMapZoomControl, VMapIconMarker } from 'vue-map-ui'
import ConfirmationDialog from './ConfirmationDialog.vue'
import common from '../mixins/common'

export default {
    name: 'RentEditor',
    props: ['id', 'user'],
    components: { ConfirmationDialog, VMap, VMapGoogleTileLayer, VMapZoomControl, VMapIconMarker },
    emits: ['cancel', 'dataChanged', 'dataAccessFailed'],
    mixins: [common],
    methods: {
        add(user) {
            this.rent.userName = user.username;
            let price = 0;
            this.cars.forEach(car=>{
                if(car.name==this.rent.carName){
                    price=car.dayPrice;
                }
            })
            this.rent.totalPrice=this.rent.dayCount*price
            fetch('/rent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.rent)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error)
                    this.$emit('dataChanged')
                })
                .catch(err => this.$emit('dataAccessFailed', err.message))
        },
        modify() {
            let price = 0;
            this.cars.forEach(car=>{
                if(car.name==this.rent.carName){
                    price=car.dayPrice;
                }
            })
            this.rent.totalPrice=this.rent.dayCount*price
            fetch('/rent?_id=' + this.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.rent)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error)
                    this.$emit('dataChanged')
                })
                .catch(err => this.$emit('dataAccessFailed', err.message))
        },
        remove() {
            this.confirmation = true
        },
        removeReal() {
            this.confirmation = false
            fetch('/rent?_id=' + this.id, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error)
                    this.$emit('dataChanged')
                })
                .catch(err => this.$emit('dataAccessFailed', err.message))
        },
        cancel() {
            this.$emit('cancel')
        },
        setMarker(event) {
            this.rent.coords = event.latlng
        },
        centerView() {
            this.center = this.rent.coords
            this.$refs.vmap.map.flyTo(this.center)
        }
    },
    data() {
        return {
            isRentValid: false,
            rules: {
                required: value => !!value || 'empty value is not allowed',
                validStartDate: value => !isNaN(new Date(value)) || 'valid date required'
            },
            rent: {
                coords: this.defaultCoords()
            },
            cars: [],
            center: this.defaultCoords(),
            dialog: false,
            confirmation: false,
            ready: false
        }
    },
    mounted() {
        fetch('/car?limit=1000', { method: 'GET' })
            .then(res => res.json())
            .then(data => this.cars = data)
        if (this.id) {
            fetch('/rent?_id=' + this.id, { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error)
                    if (!data.coords) {
                        data.coords = this.defaultCoords()
                    }
                    Object.assign(this.rent, data)
                    console.log(data)
                    Object.assign(this.center, this.rent.coords)
                    this.$refs.vmap.map.panTo(this.center)
                })
                .catch(err => console.log(err.message))
        }
    }
}
</script>