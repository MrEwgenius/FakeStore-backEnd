const Router = require('express')
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMidleware')
const orderController = require('../controllers/orderController')
const router = new Router()

router.get('/', authMiddleware, orderController.getAllOrders)
router.post('/', authMiddleware, orderController.createOrder)

module.exports = router  