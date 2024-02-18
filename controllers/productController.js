const { Product, ProductInfo, Brand, Type } = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs');

class ProductController {
    async create(req, res, next) {

        try {

            let { clothingType, gender, price, name, brandName, typeName, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({ clothingType, gender, name, price, brandName, typeName, img: fileName })

            if (info) {
                info = JSON.parse(info) 
                info.forEach(i => {
                    ProductInfo.create({
                        title: i.title, 
                        description: i.description,
                        productId: product.id,
                    }) 
                });
            }



            return res.json(product)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getAll(req, res) {
        let { brandName, typeName, limit, page } = req.query

        page = page || 1
        limit = limit || 15
        let offset = page * limit - limit
 
        let products
        if (!brandName && !typeName) {

            products = await Product.findAndCountAll({ limit, offset })
        }
        if (brandName && !typeName) {
            products = await Product.findAndCountAll({ where: { brandName }, limit, offset })
        }
        if (!brandName && typeName) {
            products = await Product.findAndCountAll({ where: { typeName }, limit, offset })            
        }
        if (brandName && typeName) {
            products = await Product.findAndCountAll({ where: { brandName, typeName }, limit, offset })
        }
        return res.json(products)

    }




    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // Находим продукт, который нужно удалить
            const product = await Product.findOne({ where: { id } });

            if (!product) {
                return next(ApiError.notFound(`Product with id ${id} not found`));
            }

            // Удаляем информацию о продукте из базы данных
            await product.destroy();
 
            // Удаляем файл изображения продукта

            const imagePath = path.resolve(__dirname, '..', 'static', product.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            return res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getFilterCards(req, res, next) {
        // try {
        const { filter } = req.params;

        // Используем метод findAll с фильтром
        const filteredProducts = await Product.findAll({
            where: {
                typeName: filter,

            },
            // include: [Type, Brand], // Включаем связанные модели, если необходимо
        });

        return res.json(filteredProducts);
        // } catch (error) { 
        //     next(ApiError.internal(error.message));
        // }
    }

    async getOne(req, res) {
        const { id } = req.params
        const product = await Product.findOne({
            where: { id },
            // include: [{ model: ProductInfo, as: 'info' }]
        })
        return res.json(product)
    }

}  

module.exports = new ProductController() 