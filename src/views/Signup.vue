<template>
  <v-layout align-center row class="mt-5">
    <v-flex text-xs-center md4 sm6 xs12 class="mx-auto mt-5">
      <v-card class="pa-3 teal lighten-3">
        <v-card-title class="justify-center headline">Sign up</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Username"
              v-model="username"
              :rules="usernameRules"
              required
            ></v-text-field>
            <v-text-field
              label="Email"
              v-model="email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="signup()" :loading="loading">Sign up</v-btn>
          <v-btn router to="/signin">Have account?</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'none',
  data() {
    return {
      username: '',
      password: '',
      email: '',
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length <= 10 || "Username cannot be more than 10 characters"
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.@+/.test(v) ||'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >=4 || 'Password must be at least 4 characters'
      ]
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
    signup() {
      if (this.$refs.form.validate()) {
        let { username, email, password } = this
        this.$store.dispatch('signupUser', {
          username,
          email,
          password
        })
      }
    }
  }
}
</script>
