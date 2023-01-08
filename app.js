const cookieParser = require('cookie-parser')
const globalErrorHandler = require('./middleware/error.middleware');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const express = require('express')
const db = require('./utils/db')
const app = express()
require('dotenv').config()

const cors = require('cors')

app.use(cors())

//all error/bugs that appear in synchronous code but are not handled anywhere are called uncaught
//exceptions
//eg of uncaughtException : console.log(x) //x doesnt exists
//should be at the top. only then it would catch error
// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! Shutting Down')
//     console.log(err.name, err)
//     process.exit(1)
// })


//GLOBAL MIDDLWARES

//Set Security HTTP Headers
app.use(helmet())
app.use(cookieParser())


//Development Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// rate limiter (allowing only 100 request per hour can be modified) from same api(in our case all apis as '/api' is specified)
const limiter = rateLimit({
    max: 1000, 
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP. Please try again in 1 hour'
})
app.use('/voter', limiter)

//Body Parser
app.use(express.json({ limit: '4000kb' })) //body should be less then 100kb

//Data Sanitization against Nosql query injection
app.use(mongoSanitize())

//Data Sanitization against XSS(attacker might send malicious html. Xss clean will sanitize these inputs)
app.use(xss())

//Prevent paramter polution
app.use(hpp())


db()
// console.log(process.env.PRIVATE)

app.use(express.json())

const AuthRoute = require('./routes/voter.routes')
const AdminRoute = require('./routes/admin.routes')

app.use('/voter', AuthRoute)
app.use('/admin', AdminRoute)

app.use(globalErrorHandler);


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

//errors outside of express(eg mongo connection error)
// process.on('unhandledRejection', err => {
//     console.log('🛩️ Unhandled Rejection! Shutting down...')
//     console.log(err.name, err.message)
//     server.close(() => {
//         process.exit(1) // 1 = > uncaught exception , 0 => success
//     })
// })
