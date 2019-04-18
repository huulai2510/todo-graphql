const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./config/db')
const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn })
}

module.exports = {
  Query: {
    getUser: async (_, args) => {
      return args
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null
      }
      const user = await User.findOne({ username: currentUser.username })
      return user
    },
    getUserTodos: async (_, { userId, sortType, sortBy, pageId }, { Todo }) => {
      const todos =
        await Todo
          .find({ createdBy: userId })
          .sort({ [sortBy ? sortBy : 'title']: sortType ? sortType : 'asc' })
          .populate({
            path: 'createdBy',
            model: 'User'
          })
          .skip(5 * (pageId ? pageId - 1 : 1))
          .limit(5)
      return todos
    },
    getTotalTodos: async (_, { userId }, { Todo }) => {
      const total = await Todo.find({ createdBy: userId }).count()
      return {total}
    }
  },
  Mutation: {
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) {
        throw new Error ('User already exists')
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save()
      return { token: createToken(newUser, config.secret, '1hr')}
    },
    signinUser: async (_, { password, username }, { User }) => {
      const user = await User.findOne({ username })
      if(!user) {
        throw new Error('user not found')
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password')
      }
      return { token: createToken(user, config.secret, '1hr')}
    },
    addTodo: async (_, { title, description, dueDate, status, createdBy }, { Todo }) => {
      const newTodo = await new Todo({
        title,
        description,
        dueDate,
        status,
        createdBy
      }).save()
      return newTodo
    },
    deleteTodo: async (_, { todoId }, { Todo }) => {
      const todo = await Todo.findOneAndDelete({ _id: todoId })
      return todo
    },
    updateTodo: async (_, { todoId, title, description, status, dueDate }, { Todo }) => {
      const todo = await Todo.findOneAndUpdate(
        { _id: todoId },
        { $set: { title, description, status, dueDate }},
        { new: true }
      )
      return todo
    }
  }
}