/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      isbncode
      booktitle
      alias1
      alias2
      date1
      date2
      date3
      date4
      Status
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isbncode
        booktitle
        alias1
        alias2
        date1
        date2
        date3
        date4
        Status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
