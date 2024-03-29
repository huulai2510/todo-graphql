import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

// setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {

    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      // eslint-disable-next-line
      console.log('[network error]', networkError)
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        // eslint-disable-next-line
        console.dir(err)
        if (err.name === "AuthenticationError") {
          store.commit('SET_AUTH_ERROR', err)
          store.dispatch('signoutUser')
        }
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient })

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')
