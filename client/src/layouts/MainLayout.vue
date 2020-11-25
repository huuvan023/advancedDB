<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ this.title }}
        </q-toolbar-title>

        <div>
          <q-btn color="white" text-color="primary"
                 @click="onLogout"
                 size="sm" label="Logout"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Routers
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import {myFirebase} from "boot/firebase";

const linksData = [
  {
    title: 'Demo firestore',
    icon: 'code',
    link: '/'
  },
  {
    title: 'Demo realtime store',
    icon: 'code',
    link: 'chat'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      title: 'asd'
    }
  },
  methods: {
    onLogout() {
      if (confirm('Sure?')) {
        localStorage.clear()
        this.$router.replace('/login')
      }
    }
  },
  mounted() {
    myFirebase.database().ref('/app_title').on('value', snapShots => {
      this.title = snapShots.val()
    })
  }
}
</script>
