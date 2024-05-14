const { where } = require('sequelize');
const ApiError = require('../error/ApiError');
const { Order, Product, OrderProduct } = require('../models/models');

class OrderController {
    async create(req, res, next) {

        try {
            // const productId = parseInt(req.body.productId, 10);
            const { productId } = req.body
            const userId = req.user.id
            // if (isNaN(productId)) {
            //     return next(ApiError.badRequest('Invalid productId'));
            // }

            const products = await Product.findAll({
                where: {
                    id: productId,
                },
            });
            const order = await Order.create({
                userId
            });


            await Promise.all(products.map(async (el) => {
                await order.addProduct(el, {
                    through: {
                        price: el.price
                    }
                })

            }))

            const productsInOrder = await order.getProducts();


            return res.json(productsInOrder)


        } catch (error) {
            next(ApiError.badRequest(error));

        }


    }
    async getAll(req, res, next) {
        const userId = req.user.id;
    
        try {
            const orders = await Order.findAll({
                where: { userId }
            });
    
            const ordersWithProducts = await Promise.all(orders.map(async (order) => {
                const products = await order.getProducts();
                return { ...order.toJSON(), products }; // Добавляем список продуктов к каждому заказу
            }));
            
            return res.json(ordersWithProducts);
        } catch (error) {
            next(ApiError.badRequest(error));
        } 
    }


}

module.exports = new OrderController()