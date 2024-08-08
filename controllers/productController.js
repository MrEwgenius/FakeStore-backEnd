const { ProductInfo, Brand, ProductImage, Type, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const { Sequelize } = require('../db');
const { Op } = require('sequelize');

class ProductController {

    async create(req, res, next) {
        let imageFileNames
        try {
            let { clothingType, gender, price, name, brandName, typeName, size, info } = req.body;
            let image = Array.isArray(req.files['image']) ? req.files['image'] : [req.files['image']]; // Проверяем, является ли изображение массивом
            let sizes = Array.isArray(req.body['size']) ? req.body['size'] : [req.body['size']]

            if (!clothingType || !gender || !price || !name || !brandName || !typeName || !size || !image) {
                return next(ApiError.badRequest("Не все обязательные поля были заполнены"));
            }
            // // // Массив для хранения имен файлов изображений 
            imageFileNames = [];
            if (!image) {
                return next(ApiError.badRequest("No image files were uploaded")); // Возвращаем ошибку, если файлы изображений не были загружены
            }
            // // // Сохраняем каждое изображение на сервере и получаем его имя 

            // // Создаем продукт в базе данных  
            for (const img of image) {
                const fileName = uuid.v4() + '.jpg';
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
                imageFileNames.push(fileName);
            }
            const product = await Product.create({
                clothingType,
                gender,
                name,
                price,
                brandName,
                typeName,
                size: sizes, // Добавляем размеры к продукту
                image: imageFileNames,
            });

            // // 
            // // Собираем данные для ответа
            // const responseData = {
            //     id: product.id,
            //     clothingType: product.clothingType,
            //     gender: product.gender, 
            //     price: product.price,
            //     name: product.name,
            //     brandName: product.brandName,
            //     typeName: product.typeName,
            //     size: sizes, // Включаем размеры продукта в ответ
            //     // Добавьте другие свойства продукта, если они есть
            //     image: imageFileNames,
            // };

            return res.json({ message: 'Продукт успешно создан' });
            // return res.json(!!image);
        } catch (error) {
            if (req.files) {
                for (const fileName of imageFileNames) {
                    fs.unlinkSync(path.resolve(__dirname, '..', 'static', fileName));
                }
                next(ApiError.badRequest(error.message));
            } else {
                next(ApiError.badRequest(error.message));


            }
        }
    }

    async getSearchProduct(req, res) {
        let { search, limit, page, } = req.query

        page = page || 1
        limit = limit || 15
        let offset = page * limit - limit
        let products

        if (search) {
            products = await Product.findAndCountAll({
                where: { name: { [Op.iLike]: `%${search}%` } },
                limit,
                offset,
            });
            return res.json(products);
        } else {
            return res.json({ message: `По поиску ${search} ничего не найдено` });

        }


    }

    async getAll(req, res) {
        let { search, price, brandName, typeName, limit, page, size, order } = req.query

        page = page || 1
        limit = limit || 15
        let offset = page * limit - limit

        let products
        let whereClause = {};

        if (brandName) {
            whereClause.brandName = brandName;
        }

        if (price) {
            const min = price[0]
            const max = price[1]
            whereClause.price = {

                [Op.gte]: parseInt(min), // больше или равно 100
                [Op.lte]: parseInt(max) // меньше или равно 200
            }
        }


        if (typeName) {
            whereClause.typeName = typeName;
        }
        if (size && Array.isArray(size)) {
            whereClause.size = { [Op.overlap]: size };
        }
        let orderClause = [];

        if (order === 'ASC') {
            orderClause = [['price', 'ASC']];
        } else if (order === 'DESC') {
            orderClause = [['price', 'DESC']];
        } else if (order === 'createdAt') {
            orderClause = [['createdAt', 'DESC']];
        }
        try {
            // if (search) {
            //     products = await Product.findAndCountAll({
            //         where: { name: { [Op.iLike]: `%${search}%` } },
            //         limit,
            //         offset,
            //         order: orderClause
            //     });
            // } else {
            products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: orderClause
            });
            // }

            return res.json(products);
        } catch (error) {
            console.error(error);
            next(ApiError.badRequest(error.message));
        }

        // products = await Product.findAndCountAll({
        //     where: whereClause,
        //     limit,
        //     offset,
        //     order: orderClause
        // });
        // return res.json(products)
        // return res.json(orderClause)

    }




    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // Находим продукт, который нужно удалить
            const product = await Product.findOne({ where: { id } });

            if (!product) {
                return next(ApiError.notFound(`Продукт с Id ${id} не найден`));
            }


            // Удаляем файл изображения продукта

            const imagePath = product.image.map(imageName =>
                path.resolve(__dirname, '..', 'static', imageName)
            );

            imagePath.forEach(imagePath => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            await product.destroy();
            return res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
   

    async getOne(req, res) {
        const { id } = req.params
        const product = await Product.findOne({
            where: { id },
            // include: ProductImage
            // include: [{ model: ProductInfo, as: 'info' }]
        })
        return res.json(product)
    }

}

module.exports = new ProductController() 