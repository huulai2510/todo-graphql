<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn
      flat icon small
      color="primary"
      slot="activator"
      v-if="type === 'edit'"
    >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn
      flat
      slot="activator"
      class="success"
      v-else
    >
      Add new project
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a new project</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            label="Title"
            v-model="title"
            prepend-icon="folder"
            :rules="titleRule"
            required
          ></v-text-field>
          <v-textarea
            label="Description"
            v-model="description"
            prepend-icon="edit"
            :rules="descriptionRule"
            required
          ></v-textarea>
          <v-select
            v-model="status"
            :items="statusOptions"
            label="status"
            prepend-icon="bookmark_border"
            required
            :rules="statusRule"
          ></v-select>
          <v-menu>
            <v-text-field
              :value="formattedDate"
              readonly
              slot="activator"
              label="Due date"
              prepend-icon="date_range"
              :rules="dateRule"
              required
            ></v-text-field>
            <v-date-picker v-model="dueDate"></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn
            flat
            class="success mx-0 mt-3"
            @click="submit()"
            :loading="loading"
          >
            {{todo ? 'update' : 'Add project'}}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import format from "date-fns/format"
import { mapGetters } from 'vuex';

export default {
  props: {
    type: String,
    todo: Object
  },
  data() {
    return {
      title: '',
      description: '',
      status: '',
      dueDate: null,
      titleRule: [
        v => !!v || 'Title is required',
        v => v.length < 10 || 'maximum length is 10 characters'
      ],
      descriptionRule: [
        v => !!v || 'Description is required',
        v => v.length < 50 || 'maximum length is 50 characters'
      ],
      statusRule: [
        v => !!v || 'status is required'
      ],
      dateRule: [
        v => !!v || 'date is required'
      ],
      statusOptions: [
        'ongoing',
        'complete',
        'overdue'
      ],
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['user', 'loading']),
    formattedDate() {
      return this.dueDate ? format(this.dueDate, 'MMM DD, YYYY') : ''
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let { title, description, status, dueDate } = this
        let action = this.todo ? 'updateTodo' : 'addTodo'
        this.$store.dispatch(action, {
          todoId: this.todo ? this.todo._id : -1,
          title,
          description,
          status,
          dueDate,
          createdBy: this.user._id
        }).then(() => {
          this.dialog = false
          this.title = ''
          this.description = ''
          this.status = ''
          this.dueDate = null
        })
      }
    }
  },
  created() {
    if (this.todo) {
      let { title, description, status, dueDate } = this.todo
      this.title = title
      this.description = description
      this.status = status
      this.dueDate = format(new Date(Number(dueDate)), 'YYYY-MM-DD')
    }
  }
}
</script>
