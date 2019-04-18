import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

import { defaultClient as apolloClient } from './main'


import {
  SIGNUP_USER,
  SIGNIN_USER,
  GET_CURRENT_USER,
  ADD_TODO,
  GET_TODOS,
  GET_TOTAL_TODOS,
  DELETE_TODO,
  UPDATE_TODO
} from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    error: null,
    loading: false,
    todos: [],
    total: 0,
    varQueryTodos: {
      pageId: 1,
      sortBy: 'title',
      sortType: 'desc'
    }
  },
  getters: {
    user: ({ user }) => user,
    error: ({ error }) => error,
    loading: ({ loading }) => loading
  },
  mutations: {
    SET_USER: (state, payload) => {
      state.user = payload
    },
    CLEAR_ERROR: state => {
      state.error = null
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_ERROR: (state, payload) => {
      state.error = payload
    },
    CLEAR_USER: state => {
      state.user = null
    },
    SET_AUTH_ERROR: (state, payload) => {
      state.authError = payload
    },
    SET_TODOS: (state, payload) => {
      state.todos = payload
    },
    SET_TOTAL_TODOS: (state, payload) => {
      state.total = payload
    },
    SET_VARIABLES_QUERY_TODOS:(state, payload) => {
      state.varQueryTodos = payload
    }
  },
  actions: {
    signupUser: ({ commit }, payload) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signupUser.token)
          router.go()
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signinUser: ({ commit }, payload) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      localStorage.setItem('token', '')
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signinUser.token)
          router.go()
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signoutUser: async ({ commit }) => {
      commit('CLEAR_USER')
      localStorage.setItem('token', '')
      await apolloClient.resetStore()
      router.push('/signin')
    },
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('SET_LOADING', false)
        commit('SET_USER', data.getCurrentUser)
      })
      .catch(() => {
        commit('SET_LOADING', false)
      })
    },
    getTodos: ({ commit, state }, payload) => {
      commit('SET_LOADING', true)
      apolloClient.query({
        query: GET_TODOS,
        variables: { userId: state.user._id, ...payload }
      })
      .then(({ data }) => {
        commit('SET_LOADING', false)
        commit('SET_TODOS', data.getUserTodos)
        commit('SET_VARIABLES_QUERY_TODOS', payload)
      })
      .catch(() => {
        commit('SET_LOADING', false)
      })
    },
    getTotalTodos: ({ commit, state }) => {
      apolloClient.query({
        query: GET_TOTAL_TODOS,
        variables: { userId: state.user._id }
      })
      .then(({ data }) => {
        commit('SET_TOTAL_TODOS', data.getTotalTodos.total)
      })
    },
    addTodo: async ({ commit, dispatch, state }, payload) => {
      commit('SET_LOADING', true)
      delete payload.todoId
      await apolloClient.clearStore()
      return apolloClient.mutate({
        mutation: ADD_TODO,
        variables: payload,
      })
      .then(() => {
        dispatch('getTotalTodos')
        dispatch('getTodos', state.varQueryTodos)
        commit('SET_LOADING', false)
      })
      .catch(() => {
        commit('SET_LOADING', false)
      })
    },
    deleteTodo: async ({ commit, dispatch, state }, payload) => {
      commit('SET_LOADING', true)
      await apolloClient.clearStore()
      apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { todoId: payload },
      })
      .then(() => {
        dispatch('getTotalTodos')
        dispatch('getTodos', state.varQueryTodos)
        commit('SET_LOADING', false)
      })
      .catch(() => {
        commit('SET_LOADING', false)
      })
    },
    updateTodo: async ({ commit, state, dispatch }, payload) => {
      commit('SET_LOADING', true)
      delete payload.createdBy
      await apolloClient.clearStore()
      apolloClient.mutate({
        mutation: UPDATE_TODO,
        variables: payload,
      })
      .then(() => {
        dispatch('getTotalTodos')
        dispatch('getTodos', state.varQueryTodos)
        commit('SET_LOADING', false)
      })
      .catch(() => {
        commit('SET_LOADING', false)
      })
    }
  }
})