const express = require('express')
const dotenv = require('dotenv')
const jobController = require('../controller/jobs')


dotenv.config()
const app = express()
app.use(express.json())

const errorMiddleware = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    res.json({
        status: 'Error',
        message: err.message
    })
}
app.use(errorMiddleware)

app.get('/jobs',jobController.jobs)
app.get('/',(req,res)=>{
    res.json({
        status: 200,
        message: 'Api work successfully'
    })
})

const server = app.listen(process.env.PORT,()=>console.log(`server running on port ${process.env.PORT}`));
server.timeout = 90000;
