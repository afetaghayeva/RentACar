<template>
  <div>
    <v-card style="overflow-y: scroll;height: 500px;">
      <v-card-title >{{ id ? 'Edit' : 'Create' }} car</v-card-title>
      <v-card-text>
        <v-form v-model="isCarValid">
          <v-text-field variant="solo" label="Name" v-model="car.name" :rules="[rules.required]"></v-text-field>
          <v-text-field variant="solo" type="number" label="Production Year" v-model="car.productionYear"
            :rules="[rules.required]"></v-text-field>
          <v-text-field variant="solo" type="number" label="Day Price" v-model="car.dayPrice"
            :rules="[rules.required]"></v-text-field>
          <v-color-picker variant="solo"  mode="rgb" v-model="car.color" hide-inputs 
            ></v-color-picker>
          <v-select v-model="car.brandName" label="Brands"
          :rules="[rules.required]"
            :items="brands.map(brand => ({ value: brand.name, title: brand.name}))" chips
            >
          </v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" :disabled="!isCarValid" v-if="!id">Add</v-btn>
        <v-btn variant="elevated" color="success" @click="modify" :disabled="!isCarValid" v-if="id">Modify</v-btn>
        <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to delete \'' + car.name + '\' ?'" @ok="removeReal"
        @cancel="confirmation = false" />
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from './ConfirmationDialog.vue'

export default {
  name: 'carEditor',
  props: ['id'],
  components: { ConfirmationDialog },
  emits: ['cancel', 'dataChanged'],
  methods: {
    add() {
      console.log(this.car)
      fetch('/car', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.car)
      })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    modify() {
      fetch('/car?_id=' + this.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.car)
      })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    remove() {
      this.confirmation = true
    },
    removeReal() {
      this.confirmation = false
      fetch('/car?_id=' + this.id, {
        method: 'DELETE'
      })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  data() {
    return {
      isCarValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed'
      },
      car: {},
      dialog: false,
      confirmation: false,
      brands: []
    }
  },
  mounted() {
    this.brands = [{_id:1,name:"Audi"},
                  {_id:2,name:"Mazda"}, 
                  {_id:3,name: "Toyota"},
                  {_id:4,name: "BMW"},
                  {_id:5,name: "Bentley"},
                  {_id:6,name: "Mercedes"},
                  {_id:7,name: "Lexus"},
                  {_id:8,name: "Honda"},
                  {_id:9,name: "Hyundai"},
                  {_id:10,name: "Ferrari"},
                  {_id:11,name: "Cadillac"}]
    if (this.id) {
      fetch('/car?_id=' + this.id, { method: 'GET' })
        .then((res) => {
          res.json()
            .then(data => {
              Object.assign(this.car, data)
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    } else {
      this.car = {
        brandName:""
      }
    }
  }
}
</script>