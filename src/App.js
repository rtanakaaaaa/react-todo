/////////1からつくったただのからのいりぐちにTODOアプリを移植
//import './App.css';  
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import { Amplify, API, graphqlOperation} from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from 'react'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App({signOut, user}) {

  const initialState = { id: '000', isbncode: '' , booktitle: '', alias1: '', alias2:'', date1: '',date2: '',date3: '',date4: '',Status:'none' }
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  
  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.alias1 || !formState.isbncode || !formState.booktitle || !formState.date1) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div>
      <Heading>
      <p className="App-header">Hello {user.username}!</p>
      <p className="App-header">Welcome to BatonPass Library</p>
      <Button onClick={signOut}>Sign out</Button>
      </Heading>
      <p>xxxxxxxxxxxxxxxxxxxxx</p>
      <input 
        className="App-todolist-input"
        onChange={event => setInput('id', event.target.value)}
        value={formState.id}
        placeholder="id"
      />
      <input 
        className="App-todolist-input"
        onChange={event => setInput('alias1', event.target.value)}
        value={formState.alias1}
        placeholder="input your Amazon alias"
      />
      <input 
        className="App-todolist-input"
        onChange={event => setInput('isbncode', event.target.value)}
        value={formState.isbncode}
        placeholder="input ISBN code"
      />
      <input 
        className="App-todolist-input"
        onChange={event => setInput('booktitle', event.target.value)}
        value={formState.booktitle}
        placeholder="book title"
      />
      <input 
        className="App-todolist-input"
        onChange={event => setInput('date1', event.target.value)}
        value={formState.date1}
        placeholder="date1"
      />
      <Button className="App-todolist-button" onClick={addTodo}>Create Todo</Button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} className="App-todolist-todo">
            <p className="App-todolist-Decription">{todo.id}</p>
            <p className="App-todolist-Decription">{todo.alias1}</p>
            <p className="App-todolist-Decription">{todo.isbncode}</p>
            <p className="App-todolist-Decription">{todo.booktitle}</p>
            <p className="App-todolist-Decription">{todo.date1}</p>
          </div>
        ))
      }
    </div>
  )
}

export default withAuthenticator(App);