const Router = require('express')
const router = new Router()

const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const basketRouter = require('./basketRouter')
const orderRouter = require('./orderRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/product', productRouter)
router.use('/basket', basketRouter) 
router.use('/order', orderRouter) 

module.exports = router   