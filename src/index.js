const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const ReporterRouter = require('./routers/reporter')
const NewsRouter = require('./routers/news')
require('./db/mongoose')

app.use(express.json())
app.use(ReporterRouter)
app.use(NewsRouter)






app.listen(port, () => {
    console.log('server is runing')
})