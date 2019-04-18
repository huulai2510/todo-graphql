import { gql } from 'apollo-boost'

export const SIGNUP_USER = gql`
  mutation($username: String!, $email:String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser{
      _id
      username
      email
      password
      avatar
      joinDate
    }
  }
`

export const ADD_TODO = gql`
  mutation($title: String!, $description: String!, $status: String!, $dueDate: String!, $createdBy: ID!) {
    addTodo(
      title: $title,
      description: $description,
      status: $status,
      dueDate: $dueDate,
      createdBy: $createdBy
    ) {
      _id
      title
      description
      status
      dueDate
      createdBy {
        _id
      }
    }
  }
`

export const GET_TODOS = gql`
  query($userId: ID!, $sortType: String, $sortBy: String, $pageId: Int) {
    getUserTodos(
      userId: $userId,
      sortType: $sortType,
      sortBy: $sortBy,
      pageId: $pageId
      ) {
      _id
      title
      description
      status
      dueDate
      createdDate
      createdBy {
        _id
        username
      }
    }
  }
`

export const GET_TOTAL_TODOS = gql`
  query($userId: ID!) {
    getTotalTodos(userId: $userId) {
      total
    }
  }
`

export const DELETE_TODO = gql`
  mutation($todoId: ID!) {
    deleteTodo(todoId: $todoId) {
      _id
      title
    }
  }
`

export const UPDATE_TODO = gql`
  mutation(
    $todoId: ID!,
    $title: String!,
    $description: String!,
    $status: String!,
    $dueDate: String!,
  ) {
    updateTodo(
      todoId: $todoId,
      title: $title,
      description: $description,
      status: $status,
      dueDate: $dueDate,
    ) {
      _id
      title
      description
      status
      dueDate
      createdBy {
        _id
      }
    }
  }
`