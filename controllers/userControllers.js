const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')
const success = require('../nodemailer')



const generateJwt = (id, email, role, userName, userLastName, adress, userNumber) => {

    return jwt.sign(
        { id, email, role, userName, userLastName, adress, userNumber },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )

}



class UserController {
    async registration(req, res, next) {
        const { email, password, role, userName, userLastName, } = req.body

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
        const token = generateJwt(user.id, user.email, user.role, user.userName, user.userLastName,)

        const message = {
            to: email,
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Пробник сообщения на майл отправлен</b>",

        }
        success(message)
        return res.json({
            token,
            message
        })
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
        const token = generateJwt(user.id, user.email, user.role, user.userName, user.userLastName, user.adress, user.userNumber)
        return res.json({ token, user })
        // return res.json({ user: req.user })  

    }
    async check(req, res, next) {

        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.userName, req.user.userLastName, req.user.adress, req.user.userNumber)

        return res.json(
            {
                id: req.user.id,
                role: req.user.role,
                userName: req.user.userName,
                email: req.user.email,
                userLastName: req.user.userLastName,
                userNumber: req.user.userNumber,
                adress: req.user.adress,
                token: token
            },


        )

    }
    async addUserAddress(req, res, next) {
        const { address } = req.body;
        const userId = req.user.id
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.userName, req.user.userLastName, address, req.user.userNumber)

        try {
            // Найдите пользователя по его ID
            const user = await User.findByPk(userId);

            if (!user) {
                // Если пользователь не найден, верните ошибку
                return next(ApiError.notFound('Пользователь не найден'));
            }

            // Обновите только поле адреса пользователя
            await user.update({ adress: address });

            // Верните обновленного пользователя в ответе
            return res.json(
                {
                    id: req.user.id,
                    role: req.user.role,
                    userName: req.user.userName,
                    email: req.user.email,
                    userLastName: req.user.userLastName,
                    adress: req.user.adress,
                    userNumber: req.user.userNumber,
                    token: token
                },
            );
        } catch (error) {
            // Если произошла ошибка, верните соответствующую ошибку API
            return next(ApiError.internal('Ошибка при обновлении адреса пользователя'));
        }
    }
    async addUserNameLastName(req, res, next) {
        const { userName, userLastName, userNumber } = req.body;
        const userId = req.user.id
        const token = generateJwt(req.user.id, req.user.email, req.user.role, userName ? userName : req.user.userName, userLastName ? userLastName : req.user.userLastName, req.user.adress, userNumber ? userNumber : req.user.userNumber
        )

        try {
            // Найдите пользователя по его ID
            const user = await User.findByPk(userId);

            if (!user) {
                // Если пользователь не найден, верните ошибку
                return next(ApiError.notFound('Пользователь не найден'));
            }
            if (userName) {


                await user.update({ userName: userName });
            }
            if (userLastName) {
                await user.update({ userLastName: userLastName });

            }
            if (userNumber) {
                try {

                    await user.update({ userNumber: userNumber });
                } catch (error) {
                    return next(ApiError.internal(error));
                }

            }

            return res.json(
                {
                    id: req.user.id,
                    role: req.user.role,
                    email: req.user.email,
                    userName: userName ? userName : req.user.userName,
                    userLastName: userLastName ? userLastName : req.user.userLastName,
                    userNumber: userNumber ? userNumber : req.user.userNumber,
                    adress: req.user.adress,
                    token
                }

            );
            // return res.json({
            //     userName: userName, 
            //     userLastName: userLastName
            // })
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении имени/номер'));
        }
    }

    async userSubscribeInner(req, res, next) {
        const { email } = req.body;

        try {

            const message = {
                to: email,
                subject: "Вы Подписаны на рассылку",
                html: 'Спасибо что подписались на рассылку)',
            };

            success(message);
            return res.json({
                userEmail: email,
                message: "Вы успешно подписались"
            })

        } catch (error) {
            return next(ApiError.internal(error));
        }



    }





}

module.exports = new UserController()