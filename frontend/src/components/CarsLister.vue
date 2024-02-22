<template>
  <div v-if="checkIfInRole(user, [ 0, 1 ])">
    <v-card variant="text">
      <v-card-title>Cars</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field variant="solo" label="Search" v-model="search" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Skip" v-model="skip" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Limit" v-model="limit" @input="retrieve"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Brand name
              </th>
              <th class="text-left">
                Production year
              </th>
              <th class="text-left">
                Day price
              </th>
              <th class="text-left">
                Color
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(car, index) in cars" :key="index" @click="checkIfInRole(user, [ 0 ]) && click(car)">
              <td>{{ car.name }}</td>
              <td>{{ car.brandName }}</td>
              <td>{{ car.productionYear }}</td>
              <td>{{ car.dayPrice }}</td>
              <td><div :style="{'background-color':car.color,'width':'20px','height':'20px','border-radius':'50%'}"></div></td>
              <td>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" v-if="checkIfInRole(user, [ 0 ])">Add</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <CarEditor :id="id" @dataChanged="retrieve" @cancel="cancel"/>
    </v-dialog>
  </div>
</template>

<script>
import common from '../mixins/common'
import CarEditor from './CarEditor.vue'

export default {
  name: 'CarsLister',
  components: { CarEditor },
  props: [ 'user' ],
  mixins: [ common ],
  methods: {
    retrieve() {
      this.id = null
      this.editor = false
      fetch('/car?search=' + this.search + '&skip=' + this.skip + '&limit=' + this.limit, {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.cars = data
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    add() {
      this.id = null
      this.editor = true
    },
    click(row) {
      this.id = row._id
      this.editor = true
    },
    cancel() {
      this.id = null
      this.editor = false
    }
  },
  data() {
    return {
      editor: false,
      cars: [],
      id: null,
      search: '',
      skip: 0,
      limit: 10
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>