const { ProductInfo, Brand, ProductImage, Type, Product } = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const { Sequelize } = require('../db');
const { Op } = require('sequelize');

class ProductController {
    // async create(req, res, next) {

    //     try {

    //         let { clothingType, gender, price, name, brandName, typeName, info } = req.body
    //         const { img } = req.files
    //         let fileName = uuid.v4() + '.jpg'
    //         img.mv(path.resolve(__dirname, '..', 'static', fileName))
    //         const product = await Product.create({ clothingType, gender, name, price, brandName, typeName, img: fileName })

    //         if (info) {
    //             info = JSON.parse(info) 
    //             info.forEach(i => {
    //                 ProductInfo.create({
    //                     title: i.title, 
    //                     description: i.description,
    //                     productId: product.id,
    //                 }) 
    //             });
    //         }



    //         return res.json(product)
    //     } catch (error) {
    //         next(ApiError.badRequest(error.message))
    //     }
    // }
    async create(req, res, next) {
        let imageFileNames
        try {
            let { clothingType, gender, price, name, brandName, typeName, size, info } = req.body;
            let image = Array.isArray(req.files['image']) ? req.files['image'] : [req.files['image']]; // Проверяем, является ли изображение массивом
            let sizes = Array.isArray(req.body['size']) ? req.body['size'] : [req.body['size']]

            if (!clothingType || !gender || !price || !name || !brandName || !typeName || !size || !image) {
                return next(ApiError.badRequest("Не все обязательные поля были заполнены"));
            }
            // // Массив для хранения имен файлов изображений 
            imageFileNames = [];
            // if (!image) {
            //     return next(ApiError.badRequest("No image files were uploaded")); // Возвращаем ошибку, если файлы изображений не были загружены
            // }
            // // Сохраняем каждое изображение на сервере и получаем его имя 

            // Создаем продукт в базе данных  
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

            // 
            // Собираем данные для ответа
            const responseData = {
                id: product.id,
                clothingType: product.clothingType,
                gender: product.gender,
                price: product.price,
                name: product.name,
                brandName: product.brandName,
                typeName: product.typeName,
                size: sizes, // Включаем размеры продукта в ответ
                // Добавьте другие свойства продукта, если они есть
                image: imageFileNames,
            };

            return res.json({ message: 'Продукт успешно создан' });
        } catch (error) {
            for (const fileName of imageFileNames) {
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', fileName));
            }
            next(ApiError.badRequest(error.message));
        }
    }


    async getAll(req, res) {
        let { price, brandName, typeName, limit, page, size } = req.query

        page = page || 1
        limit = limit || 15
        let offset = page * limit - limit

        let products
        let whereClause = {};
        // if (!brandName && !typeName) {
        //     products = await Product.findAndCountAll({ limit, offset })
        // }
        // if (brandName && !typeName) {
        //     products = await Product.findAndCountAll({ where: { brandName }, limit, offset })
        // }
        // if (!brandName && typeName) {
        //     products = await Product.findAndCountAll({ where: { typeName }, limit, offset })
        // }
        // if (brandName && typeName) {
        //     products = await Product.findAndCountAll({ where: { brandName, typeName }, limit, offset })
        // }
        if (brandName) {
            whereClause.brandName = brandName;
        }
        // if (price) {
        //     const min = price[0]
        //     const max = price[1]
        //     whereClause.price = { [Op.lte]: price }
        // }
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
        if (size) {
            whereClause.size = { [Op.contains]: [size] }
        }
        products = await Product.findAndCountAll({ where: whereClause, limit, offset });
        return res.json(products)

    }




    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // Находим продукт, который нужно удалить
            const product = await Product.findOne({ where: { id } });

            if (!product) {
                return next(ApiError.notFound(`Продукт с Id ${id} не найден`));
            }

            // // Удаляем информацию о продукте из базы данных

            // Удаляем файл изображения продукта

            // const imagePath = path.resolve(__dirname, '..', 'static', product.image);
            const imagePath = product.image.map(imageName =>
                path.resolve(__dirname, '..', 'static', imageName)
            );
            // if (fs.existsSync(imagePath)) {
            //     fs.unlinkSync(imagePath);
            // }
            imagePath.forEach(imagePath => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            await product.destroy();
            return res.json({ message: 'Product deleted successfully' });
            // return res.json({ imagePath });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    // async getFilterCards(req, res, next) {
    //     // try {
    //     const { filter } = req.params;

    //     // Используем метод findAll с фильтром
    //     const filteredProducts = await Product.findAll({
    //         where: {
    //             typeName: filter,

    //         },

    //         // include: [Type, Brand], // Включаем связанные модели, если необходимо
    //     });

    //     return res.json(filteredProducts);
    //     // } catch (error) { 
    //     //     next(ApiError.internal(error.message));
    //     // }
    // }

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