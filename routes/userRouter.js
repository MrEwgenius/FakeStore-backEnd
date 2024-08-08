const Router = require('express')
const router = new Router()
const userController = require('../controllers/userControllers')
const authMiddleware = require('../middleware/authMidleware')


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.post('/useraddress', authMiddleware, userController.addUserAddress)
router.post('/usernamelastname', authMiddleware, userController.addUserNameLastName)
router.post('/usersubscribe', authMiddleware, userController.userSubscribeInner)

module.exports = router 