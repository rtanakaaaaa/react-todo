//https://github.com/simoneb/axios-hooks
/////////fetchには失敗するが他は動く。↑を参考に本のデータをjsonでとれた
import './App.css';  
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import { Amplify, API, graphqlOperation} from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from 'react'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import awsExports from "./aws-exports";
import useAxios from 'axios-hooks'

Amplify.configure(awsExports);

function App({signOut, user}) {
  const alias1 = user.username
  const initialState = { isbncode: '' , booktitle: '', alias1: alias1 , alias2:'', date1: '' ,date2: '',date3: '',date4: '',Status:'registered' }
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
      console.log('fetching todos') 
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.isbncode || !formState.booktitle || !formState.date1) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
      console.log('creating todo')
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
  
  //const rakutenwebapiurl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${appid}&isbn=${isbncode}'
  const rakutenwebapiurl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=1006474168608188311&isbn=9784797395235'
  //const tempurl = 'https://reqres.in/api/users?delay=1'
  const [{ data, loading, error }, refetch] = useAxios(
    rakutenwebapiurl
  )
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

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
      <Button className="App-todolist-button" onClick={refetch}>refetch</Button>
      <p>{JSON.stringify(data, null, 2)}</p>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} className="App-todolist-todo">
            <p className="App-todolist-alias1">{todo.alias1}</p>
            <p className="App-todolist-isbncode">{todo.isbncode}</p>
            <p className="App-todolist-booktitle">{todo.booktitle}</p>
            <p className="App-todolist-date1">{todo.date1}</p>
            <p className="App-todolist-Status">{todo.Status}</p>
          </div>
        ))
      }
    </div>
  )
}

export default withAuthenticator(App);