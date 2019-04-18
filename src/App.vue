<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="isShowNav" />
    <v-content class="mx-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data () {
    return {
      isShowNav: false,
      pathNotShowNav: [
        '/signin',
        '/signup'
      ]
    }
  },
  watch: {
    '$route'(val) {
      this.isShowNav = this.pathNotShowNav.indexOf(val.path) < 0
    }
  },
  created() {
    this.isShowNav = this.pathNotShowNav.indexOf(this.$route.path) < 0
  }
}
</script>
