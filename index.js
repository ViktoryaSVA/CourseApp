const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const md5 = require('md5')
const User = require('./models/user')

const app = express()

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) =>  {
    try {
        const user = await User.findById('6090641e9f35c746ea8c68bb')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect("mongodb://localhost:27017/courseDB", {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'vika@email.com',
                name: 'vika',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }


}
start()

