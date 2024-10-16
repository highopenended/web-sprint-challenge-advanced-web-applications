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


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () =>  navigate('/articles')



  const logout = () => {
    localStorage.removeItem("token")
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
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
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await fetch(articlesUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        }      
      })
      .then(res=>{
        if (!res.ok) throw new Error(res.status)        
        return res.json()  
      })
      .then(data =>{
        setArticles(data.articles)
        setMessage(data.message)
      })
    } catch (err) {
      if(err.message=="401"){
        console.log("Removing token")
        logout()
      }
    }
    setSpinnerOn(false)
  }

  const postArticle = async (article) => {
    setSpinnerOn(true)
    try {
      const res = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(article)
      })
      .then(res=>{
        if (!res.ok) throw new Error(res.status)        
        return res.json()  
      })
      .then(data=>{
        console.log(data.message)
        setArticles([...articles, data.article])
        setMessage(data.message)
      })
    } catch (err) {
      console.log(err.message)
    }
    setSpinnerOn(false)
  }

  const updateArticle = async ({ article_id, article }) => {
    setSpinnerOn(true)
    try {
      const res = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(article)
      })
      .then(res=>{
        if (!res.ok) throw new Error(res.status)        
        return res.json()  
      })
      .then(data=>{
        console.log(data)
        setArticles(articles.map(art=>{
          return art.article_id===article_id
            ? data.article
            : art
        }))
        setMessage(data.message)
      })
    } catch (err) {
      console.log(err.message)
    }
    setSpinnerOn(false)

  }



  const deleteArticle = async article_id => {
    const url = `${articlesUrl}/${article_id}`
    setMessage('')
    setSpinnerOn(true)
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        }
      })
      .then(res=>{
        if (!res.ok) throw new Error(res.status)  
        return res.json()  
      })
      .then(data =>{
        setMessage(data.message)
        setArticles(articles.filter(art=>art.article_id!==article_id))
      })
    } catch (err) {
      if(err.message=="401"){
        console.log("Removing token")
        logout()
      }
    }
    setSpinnerOn(false)
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
              <ArticleForm articles={articles} updateArticle={updateArticle} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} postArticle={postArticle} />
              <Articles redirectToLogin={redirectToLogin} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} articles={articles} getArticles={getArticles} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
