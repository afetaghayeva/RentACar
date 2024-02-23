<template>
  <div v-if="checkIfInRole(user, [0, 1])">
    <v-card variant="text">
      <v-card-title>Rents</v-card-title>
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
                Description
              </th>
              <th class="text-left">
                Rent date
              </th>
              <th class="text-left">
                Day count
              </th>
              <th class="text-left">
                Total price
              </th>
              <th class="text-left">
                Car
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rent, index) in rents" :key="index" @click="checkIfInRole(user, [0]) && click(rent)">
              <td>{{ rent.description }}</td>
              <td class="text-right">{{ new Date(rent.rentDate).toLocaleDateString() }}</td>
              <td>{{ rent.dayCount }}</td>
              <td>{{ rent.totalPrice }}</td>
              <td>
                <v-chip>
                  {{ rent.carName }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" v-if="checkIfInRole(user, [0])">Add</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <RentEditor :id="id" :user="user" @dataChanged="retrieve" @cancel="cancel" />
    </v-dialog>
  </div>
</template>
  
<script>
import common from '../mixins/common'
import RentEditor from './RentEditor.vue'

export default {
  name: 'RentsLister',
  components: { RentEditor },
  props: ['user'],
  mixins: [common],
  methods: {
    retrieve() {
      this.id = null
      this.editor = false
      fetch('/rent?search=' + this.search + '&skip=' + this.skip + '&limit=' + this.limit, {
        method: 'GET'
      })
        .then((res) => {
          res.json()
            .then((data) => {
              this.rents = data
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
      rents: [],
      totalPrice: 0,
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