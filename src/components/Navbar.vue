<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon class="grey--text" @click="drawer=!drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Todo</span>
        <span>Ninja</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <v-btn flat slot="activator" color="grey">
          <v-icon>expand_more</v-icon>
          <span>Menu</span>
        </v-btn>
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-tile-title>{{link.text}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn flat color="grey" @click="handleSignoutUser()">
        <span>Sign out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-layout column align-center>
        <v-flex class="mt-5 center">
          <v-avatar size="100" class="mx-auto">
            <img :src="user.avatar" alt="avatar"/>
          </v-avatar>
          <p class="white--text subheading mt-1 text-xs-center">
            {{user.username}}
          </p>
        </v-flex>
        <v-flex class="mt-4 mb-3">
          <Popup/>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="item in links" :key="item.text" router :to="item.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{item.text}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

  </nav>
</template>
<script>
import Popup from './Popup'
import { mapGetters } from 'vuex';
export default {
  components: {
    Popup
  },
  data() {
    return {
      drawer: true,
      links: [
        {icon: 'dashboard', text: 'Dashboard', route: '/'},
        {icon: 'person', text: 'About', route: '/about'}
      ]
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    }
  }
}
</script>