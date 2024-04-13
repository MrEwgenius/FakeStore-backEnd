const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')



const generateJwt = (id, email, role, userName, userLastName) => {

    return jwt.sign(
        { id, email, role, userName, userLastName },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )

}



class UserController {
    async registration(req, res, next) {
        const { email, password, role, userName, userLastName } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword, userName, userLastName })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJwt(user.id, user.email, user.role, user.userName, user.userLastName)
        return res.json({ token })
        // return res.json({user})

    }
    async login(req, res, next) {
        const { email, password, role, userName, userLastName } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role, user.userName, user.userLastName)
        return res.json({ token, role: user.role })

    }
    async check(req, res, next) {

        // res.json({ message: 'работает' })
        const token = generateJwt(req.user.id, req.user.email, req.user.role)

        return res.json({ token, role: req.user.role })
    }

}

module.exports = new UserController()