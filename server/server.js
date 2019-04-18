const  { ApolloServer, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

const { url, secret } = require('./config/db')
const User = require('./models/User')
const Todo = require('./models/Todo')

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('db connected'))
  .catch(err => console.error(err))

const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, secret)
    } catch (err) {
      throw new AuthenticationError('Your session has ended, please sign in again')
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return {User, Todo, currentUser: await getUser(token)};
  }
})

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
})