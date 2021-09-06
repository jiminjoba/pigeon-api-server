const express = require('express')
const mongoose = require('mongoose')
const hob = require('express-handlebars')
const PegionRoutes = require('./routes/todos')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = hob.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(PigeonRoutes)

async function start () {
    try {
      await mongoose.connect('mongodb+srv://andrew:Spudyman413@cluster0.cn6hb.mongodb.net/Pigeon', {
        useNewUrlParser: true,
        useFindAndModify: false
    })
      
    app.listen(PORT, () => {
        console.log('Server has been started')
    })
    } catch (e) {
      console.log(e)
    }
}

start()

