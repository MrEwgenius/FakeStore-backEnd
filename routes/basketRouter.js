const Router = require('express')
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMidleware')
const router = new Router()

router.get('/', authMiddleware, basketController.getAll)
router.post('/addbasketproduct', authMiddleware, basketController.basketProduct)
router.get('/getbasketproduct', authMiddleware, basketController.getBasketItems)
router.delete('/delbasketproduct/:id', authMiddleware, basketController.removeBasketItems)

module.exports = router  