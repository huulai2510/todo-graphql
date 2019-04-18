<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-container class="my-5" v-if="todos.length">
      <v-layout row class="mb-3">
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortTodos('title')" slot="activator">
            <v-icon left small>folder</v-icon>
            <span class="caption text-lowercase"> By title</span>
          </v-btn>
          <span>Sort todos by title</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortTodos('dueDate')" slot="activator">
            <v-icon left small>alarm_on</v-icon>
            <span class="caption text-lowercase"> By due date</span>
          </v-btn>
          <span>Sort todos by due date</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortTodos('createdDate')" slot="activator">
            <v-icon left small>calendar_today</v-icon>
            <span class="caption text-lowercase"> By created date</span>
          </v-btn>
          <span>Sort todos by created date</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortTodos('status')" slot="activator">
            <v-icon left small>settings_ethernet</v-icon>
            <span class="caption text-lowercase"> By status</span>
          </v-btn>
          <span>Sort todos by status</span>
        </v-tooltip>
      </v-layout>
      <v-card flat v-for="todo in todos" :key="todo._id">
        <v-layout row wrap :class="`pa-3 project ${todo.status}`" @click="showDescription(todo._id)">
          <v-flex xs12 md4>
            <v-tooltip bottom>
              <div slot="activator">
                <div class="caption grey--text">Title</div>
                <div>{{todo.title}}</div>
              </div>
              <span>{{todo.description}}</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Created date</div>
            <div>{{formatDate(todo.createdDate)}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Due by</div>
            <div>{{formatDate(todo.dueDate)}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <v-chip small :class="`${todo.status} white--text caption`">{{todo.status}}</v-chip>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <Popup :type="'edit'" :todo="todo" />
            <v-btn flat icon small color="red" right @click="deleteTodo(todo._id)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <!-- <v-card v-show="todoSelected === todo._id" :class="`project ${todo.status}`">
          <v-card-title class="caption grey--text">Description</v-card-title>
          <v-card-text>{{todo.description}}</v-card-text>
        </v-card> -->
        <v-divider></v-divider>
      </v-card>
      <v-pagination
        :length="totalPage"
        :total-visible="7"
        v-model="pageId"
      ></v-pagination>
    </v-container>
    <v-container class="my-5" v-else>
      <v-layout row wrap >
        <v-flex xs12>
          <v-card>
            <v-img
              src="https://image.flaticon.com/icons/png/512/25/25361.png"
              height="250"
              width="250"
              class="mx-auto"
            ></v-img>
            <v-card-title primary-title  class="text-xs-center">
            <div style="width: 100%;">
              <h3 class="headline mb-0">Welcome to project Todo-Graphql !!!</h3>
              <h3 class="headline mb-0">You can create a todo list here. Please click <router-link to="/about">here</router-link> to know more!</h3>
            </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import Popup from '../components/Popup'

export default {
  components: {
    Popup
  },
  data() {
    return {
      todoSelected: null,
      pageId: 1,
      sortBy: 'title',
      sortType: 'asc'
    }
  },
  computed: {
    ...mapState(['todos', 'total']),
    totalPage() {
      return Math.ceil(this.total / 5)
    }
  },
  watch: {
    pageId(val) {
      if (val) {
        this.getTodos()
      }
    }
  },
  methods: {
    ...mapActions(['deleteTodo']),
    sortTodos(prop) {
      if (this.sortBy === prop) {
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = prop
        this.sortType = 'desc'
      }
      this.getTodos()
    },
    formatDate(date) {
      return moment(+date).format('MMM DD, YYYY')
    },
    showDescription(todoId) {
      this.todoSelected = todoId === this.todoSelected ? null : todoId
    },
    getTodos() {
      let { pageId, sortBy, sortType } = this
      this.$store.dispatch('getTodos', {
        sortBy,
        sortType,
        pageId
      })
    }
  },
  created() {
    this.getTodos()
    this.$store.dispatch('getTotalTodos')
  }
}
</script>
<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.overdue {
  border-left: 4px solid orange;
}
.project.ongoing {
  border-left: 4px solid tomato;
}
.v-chip.complete {
  background-color: #3cd1c2;
}
.v-chip.overdue {
  background-color: orange;
}
.v-chip.ongoing {
  background-color: tomato;
}
</style>
