<template>
  <div class="q-ma-md">
    <div class="q-my-md flex">
      <q-input style="width: 300px" filled v-model="keyword" label="Search by name" />
      <div class="flex items-center">
        <q-btn label="Search" class="q-ml-md" @click="Search" color="primary"/>
      </div>
    </div>
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="name">
      <template v-slot:top>
        <q-btn  outline color="primary" :label="`Add product`" @click="() => {dialog = !dialog; label = 'Add'}" />
        <q-space />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="Action" :props="props">
            <q-btn label="Update" @click="onUpdate(props.row)" size="sm" color="primary"/>
            <q-btn label="Delete" @click="onDelete(props.row)" class="q-ml-sm" size="sm" color="negative"/>
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="Name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="Price" :props="props">
              {{ props.row.price }}
          </q-td>
          <q-td key="Img" :props="props">
              <img :src="props.row.img" style="width: 100px; height: 100px"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog class="bg-white" v-model="dialog">
      <div class="q-pa-md bg-white"
           style="width: 500px">
        <div class="text-weight-bold text-h6 q-mb-sm">{{ `${label} product` }}</div>
        <q-form class="q-gutter-md" >
          <q-input
            filled
            v-model="newProduct.name"
            label="Name"
            lazy-rules
          />
          <q-input
            filled
            v-model="newProduct.price"
            label="Price"
            lazy-rules
          />
          <div class="flex justify-center">
            <q-img v-if="newProduct.img" :src="newProduct.img" style="max-width: 300px; border: 1px solid black" />
          </div>
          <div class="flex justify-center">
            <q-uploader
              @added="onUpload"
              url=""
              accept=".png, .jpeg, .jpg/*, image/*"
              @rejected="onRejectImg"
              max-file-size="1024000"
              label="Upload image"
              class=" q-mx-md"
            />
          </div>
          <div class="col-12 flex justify-center">
            <q-btn v-if="label === 'Add'" label="Add new product" @click="Submit" outline color="primary"/>
            <q-btn v-else label="Update product" @click="Update" outline color="primary"/>
          </div>
        </q-form>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import {myFirebase, myFirestore} from "boot/firebase";

export default {
  name: 'PageIndex',
  data: () => ({
    dialog: false,
    columns: [
      { name: 'Action', label: 'Action', field: 'Action', align: 'center'},
      { name: 'id', label: 'Id', field: 'id', align: 'left'},
      { name: 'Name', label: 'Name', field: 'name', align: 'left'},
      { name: 'Price', align: 'center', label: 'Price', field: 'price', sortable: true },
      { name: 'Img', label: 'Image', field: 'img'}
    ],
    tableData: [],
    newProduct: {},
    isPwd: false,
    keyword: '',
    label : 'Add'
  }),
  computed: {
    data() {
      return this.tableData
    }
  },
  methods: {
    async onUpload(file) {
      this.$q.loading.show()
      const storageRef= myFirebase.storage().ref(`${(new Date()).getMilliseconds()}`).put(file[0]);
      await storageRef.on(`state_changed`,
        snapshot => {
        },
        error => {
        console.log(error.message)
        },
        () => {
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.newProduct.img = url
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Add new image success!',
            icon: 'error',
            type: 'positive',
            timeout: 500,
            position: 'top-right'
          })
          });
        }
      );
    },
    async onDelete(product) {
      if (confirm(`Delele ${product.name}?`)) {
        this.$q.loading.show()
        const doc = myFirestore.doc(`/listProduct/${product.id}`)
        return doc.delete()
        .then(() => {
          this.$q.notify({
            message: 'Delete product success!',
            icon: 'error',
            type: 'positive',
            timeout: 500,
            position: 'top-right'
          })
          return this.loadProduct()
        })
        .then(() => {
          return this.$q.loading.hide()
        })
        .catch(err => {
          this.$q.notify({
            message: err.code,
            icon: 'error',
            type: 'negative',
            timeout: 500,
            position: 'top-right'
          })
          this.$q.loading.hide()
        })

      }
    },
    async Update() {
      this.$q.loading.show()
      const doc = myFirestore.doc(`/listProduct/${this.newProduct.id}`)
      await doc.update({
        img: this.newProduct.img,
        price: this.newProduct.price,
        name: this.newProduct.name
      })
      .then(() => {
        this.dialog = false
        return this.$q.notify({
          message: 'Update product success!',
          icon: 'error',
          type: 'positive',
          timeout: 500,
          position: 'top-right'
        })
      })
      .catch(err => {
        this.$q.notify({
          message: err.code,
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      })
      this.$q.loading.hide()
    },
    async onUpdate(product) {
      this.$q.loading.show()
      this.label = 'Update'
      this.newProduct = product
      this.dialog = true
      this.$q.loading.hide()
    },
    onRejectImg(err) {
      this.$q.notify({
        message: err[0].failedPropValidation,
        color: "negative",
        position: "top"
      })
    },
    async Submit() {
      if (this.newProduct.name && this.newProduct.price && this.newProduct.img) {
        await myFirestore.collection('listProduct').add({
          img: this.newProduct.img,
          name: this.newProduct.name,
          price: this.newProduct.price
        })
        .then(() => {
          this.dialog = false
          return this.$q.notify({
            message: 'Add new product success!',
            icon: 'error',
            type: 'positive',
            timeout: 500,
            position: 'top-right'
          })
        })
        .catch(err => {
          this.$q.notify({
            message: err.code,
            icon: 'error',
            type: 'negative',
            timeout: 500,
            position: 'top-right'
          })
        })
        await this.loadProduct()
        this.newProduct = {}
      }
      else {
        this.$q.notify({
          message: 'Field can not be empty!',
          icon: 'error',
          type: 'negative',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    async Search() {
      this.$q.loading.show()
      await myFirestore.collection('listProduct')
      .where("name","==",this.keyword)
      .get()
      .then(data => {
        var tableData = []
        data.forEach(item => {
          tableData.push({
            id: item.id,
            img: item.data().img,
            price: item.data().price,
            name: item.data().name
          })
        })
        this.tableData = tableData
      })
      this.$q.loading.hide()
    },
    async loadProduct() {
      this.$q.loading.show()
      await  myFirestore.collection('listProduct').onSnapshot(async snapShots => {
        let tableData = []
        await snapShots.forEach(changed => {
          tableData.push({
            id: changed.id,
            img: changed.data().img,
            price: changed.data().price,
            name: changed.data().name
          })
        })
        this.tableData = tableData
        this.$q.loading.hide()
      })
    }
  },
  async mounted() {
    await this.loadProduct()
  }
}
</script>
