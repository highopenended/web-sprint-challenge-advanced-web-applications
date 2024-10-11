import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [username, setUsername] = useState('')

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () =>  navigate('/articles')
  

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)

    console.log("Username: ", username)
    console.log("Password: ", password)

    fetch(loginUrl, {
      method: 'POST', 
      body: JSON.stringify({ 
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Error!!!')
      }
      return response.json()
    })
    .then(data => {
      console.log('Success:', data)
      setMessage(data.message)
      localStorage.setItem("token",data.token)
      redirectToArticles()
    })
    .catch(error => {
      console.error('Error:', error)
    })
    setSpinnerOn(false)
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    // setMessage('')
    // setSpinnerOn(true)
    try {
      const res = await fetch(articlesUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        }      
      })
      .then(res=>{
        if (!res.ok) {
          throw new Error(`Something is wrong: ${res.status}`)
        }
        return res.json()  
      })
      .then(data =>{
        console.log(data.articles)
        setArticles(data.articles)
        setMessage(data.message)
      })
      
      // const data = await res.json()  
      // console.log(data)
      // setArticles(data.articles)
      // setMessage(data.message)
    } catch (err) {
      console.log(err.message)
    }
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} postArticle={postArticle} />
              <Articles redirectToLogin={redirectToLogin} setCurrentArticleId={setCurrentArticleId} articles={articles} getArticles={getArticles} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
