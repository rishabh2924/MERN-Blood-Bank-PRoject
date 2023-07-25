const express = require('express')
const dotenv= require('dotenv')
const colors=require('colors')
const morgan = require('morgan')
const cors=require('cors')
const { connect } = require('./Routes/testRoute')
const connectDB = require('./config/db')
const path=require('path')

//dot config
dotenv.config();

//connection to db
connectDB()

//rest objects
const app=express();

//middle wares
app.use(express.json())
app.use(cors()) // cross origin resources -- resources are shared across different servers
app.use(morgan('dev'))

//routes
app.use('/api/v1/test',require('./Routes/testRoute'))
app.use('/api/v1/auth', require('./Routes/authRoutes'));
app.use('/api/v1/inventory',require('./Routes/inventoryRoutes'))
app.use('/api/v1/analytics',require('./Routes/analyticsRoutes'))
app.use('/api/v1/admin',require('./Routes/adminRoutes'))

//STATIC FILES
app.use(express.static(path.join(__dirname,'./client/build')))

//Static routes
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

//port
const PORT=process.env.PORT || 8080;

// listen
app.listen(PORT,()=>{
    console.log(`listening to ${PORT}...` .bgBlue .white)
})