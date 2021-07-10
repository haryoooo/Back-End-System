const moviesRouters = require('./router/moviesRouter')
const userRouters = require('./router/userRouter')
const {urlencoded} = require('express')
const express = require('express')

const app = express(express)

const PORT = "3000"

app.use(urlencoded({extended: false}))
app.use(express.json())


app.use(moviesRouters)
app.use(userRouters)

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})