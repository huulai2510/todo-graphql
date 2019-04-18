<template>
  <v-layout align-center row class="mt-5">
    <v-flex text-xs-center md4 sm6 xs12 class="mx-auto mt-5">
      <v-card class="pa-3 teal lighten-3">
        <v-card-title class="justify-center headline">Sign in</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Username" v-model="username" @keypress.enter="signin()"></v-text-field>
            <v-text-field label="Password" v-model="password" type="password" @keypress.enter="signin()"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="signin()" :loading="loading">Sign in</v-btn>
          <v-btn light router to="/signup">Sign up</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'signin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['user', 'loading'])
  },
  watch: {
    user(val) {
      if (val) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    signin() {
      let { username, password } = this
      this.$store.dispatch("signinUser", { username, password })
    }
  }
}
</script>
