const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')



const generateJwt = (id, email, role, userName, userLastName, adress,) => {

    return jwt.sign(
        { id, email, role, userName, userLastName, adress },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )

}



class UserController {
    async registration(req, res, next) {
        const { email, password, role, userName, userLastName, adress } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword, userName, userLastName, adress })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJwt(user.id, user.email, user.role, user.adress, user.userName, user.userLastName)
        return res.json({ token })
        // return res.json({user})

    }
    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role, user.userName, user.userLastName, user.adress,)
        return res.json({ token, user })
        // return res.json({ user: req.user })  

    }
    async check(req, res, next) {

        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.userName, req.user.userLastName, req.user.adress)

        return res.json(
            {
                id: req.user.id,
                role: req.user.role,
                userName: req.user.userName,
                email: req.user.email,
                userLastName: req.user.userLastName,
                adress: req.user.adress,
                token: token
            },


        )

    }

}

module.exports = new UserController()