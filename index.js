require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

// allows us to use res.json
app.use(express.json())
// allows access from all origins
app.use(cors())
// bodyparser middleware
app.use(express.urlencoded({extended: false}))
// controller middleware
app.use('/api', require('./controllers/users'))

app.listen(process.env.PORT || 8000, ()=>{
    console.log('superonics MERN AUTH 8000')
})