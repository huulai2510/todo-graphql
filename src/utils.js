export const deleteGetUserTodos = cache => {
  // Loop through all the data in our cache
  // And delete any items that start with "ListItem"
  // This empties the cache of all of our list items and 
  // forces a refetch of the data.
  Object.keys(cache.data.data.ROOT_QUERY).forEach(key => {
    key.match(/^getUserTodos/) && delete cache.data.data.ROOT_QUERY[key]
  }
  )
}

export const deleteGetTotalTodos = cache => {
  // Loop through all the data in our cache
  // And delete any items that start with "ListItem"
  // This empties the cache of all of our list items and 
  // forces a refetch of the data.
  Object.keys(cache.data.data.ROOT_QUERY).forEach(key => {
    key.match(/^getTotalTodos/) && delete cache.data.data.ROOT_QUERY[key]
  }
  )
}