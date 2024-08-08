const { Brand, Basket, BasketProduct, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken');
class BasketController {



    async getAll(req, res, next) {
        const userId = req.user.id
        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            return res.json([]); // Если корзина не найдена, возвращаем пустой массив
        }
        return res.json([basket]); // Возвращаем корзину пользователя

      
    }

    async basketProduct(req, res, next) {
        try {
            let { productId, sizeBasketProduct } = req.body; // Получите идентификатор товара и количество из тела запроса
            // const { id } = req.params;
            let userId = req.user.id; // Получите идентификатор пользователя из аутентификационного токена

            // Проверьте, существует ли корзина для данного пользователя
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                // Если корзина не существует, создайте новую
                basket = await Basket.create({ userId });
            }

            // Добавьте товар в корзину пользователя
            let basketProduct = await BasketProduct.create({
                basketId: basket.id,
                productId,
                sizeBasketProduct
            });

            const basketItems = await BasketProduct.findAll({ where: { basketId: basket.id } });
            // Создаем массив идентификаторов продуктов из корзины
            const productIds = basketItems.map(item => item.productId);

            // Находим все товары с помощью идентификаторов
            const products = await Product.findAll({
                where: { id: productIds }
                // include: [{ model: ProductInfo, as: 'info' }]
            });

            res.status(201).json(
                products
            );
        } catch (error) {
            next(error);
        }
    }


    async getBasketItems(req, res, next) {
        try {
            const userId = req.user.id; // Идентификатор пользователя из аутентификационного токена

            // Находим корзину пользователя
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            // Находим все товары в корзине пользователя
            const basketItems = await BasketProduct.findAll({ where: { basketId: basket.id } });
            // Создаем массив идентификаторов продуктов из корзины
            const productIds = basketItems.map(item => item.productId);

            // Находим все товары с помощью идентификаторов
            const product = await Product.findAll({
                where: { id: productIds },
                // include: [{ model: ProductInfo, as: 'info' }]
            },);
            const productDetails = product.map(product => ({
                id: product.id,
                clothingType: product.clothingType,
                gender: product.gender,
                price: product.price,
                name: product.name,
                brandName: product.brandName,
                typeName: product.typeName,
                size: product.size,
                image: product.image,
                sizeBasketProduct: basketItems.find(b => b.productId === product.id).sizeBasketProduct, // Проверка соответствия basketItem
            }));
            res.status(200).json(
                {
                    products: productDetails
                },


            );

            // Возвращаем список товаров в ответе
        } catch (error) {
            next(error);
        }
    }
    async removeBasketItems(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id; 
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }
            const basketItem = await BasketProduct.findOne({ where: { productId: id } });
            if (!basketItem) {
                return res.status(404).json({ message: 'Элемент корзины не найден' });
            }

            await basketItem.destroy();

            res.status(200).json({ message: 'Элемент корзины успешно удален' });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new BasketController()