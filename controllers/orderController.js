const { where } = require('sequelize');
const ApiError = require('../error/ApiError');
const { Order, Product,  } = require('../models/models');
const success = require('../nodemailer')
const path = require('path');
const { createOrderConfirmationEmailHtml, createProductListItemHtml } = require('../render/emailTemplates'); 



class OrderController {
    async createOrder(req, res, next) {

        try {
            const { productId, sizeProduct } = req.body
            const userId = req.user.id
            const userEmail = req.user.email

            const products = await Product.findAll({
                where: {
                    id: productId,
                },
            });
            const order = await Order.create({ userId });

            await Promise.all(products.map(async (el, index) => {
                await order.addProduct(el, {
                    through: {
                        price: el.price, 
                        size: sizeProduct[index]
                    }
                })

            }))


            const orderedProducts = await order.getProducts();

            const totalPrice = orderedProducts.reduce((sum, product) => sum + (product.order_product.price * product.order_product.quantity), 0);

            const emailAttachments = orderedProducts.map(product => ({
                filename: path.basename(product.image[0]),
                path: path.resolve(__dirname, '..', 'static', product.image[0]),
                cid: `${product.id}`
            }));
            const productListHtml = orderedProducts.map(product => createProductListItemHtml(product.id, product.name, product.order_product.size, product.order_product.price)).join('');

            const message = {
                to: userEmail,
                subject: "Ваш заказ подтвержден",
                html: createOrderConfirmationEmailHtml(order.id, productListHtml, totalPrice),
                attachments: emailAttachments
            };

            success(message);


            return res.json(orderedProducts)


        } catch (error) {
            next(ApiError.badRequest(error));
            // return res.json(error)


        }


    }
    async getAllOrders(req, res, next) {
        const userId = req.user.id;

        try {
            const orders = await Order.findAll({
                where: { userId }
            });

            const ordersWithProducts = await Promise.all(orders.map(async (order) => {
                const products = await order.getProducts();
                return { ...order.toJSON(), products }; 
            }));

            return res.json(ordersWithProducts);
        } catch (error) {
            next(ApiError.badRequest(error));
        }
    }


}

module.exports = new OrderController()