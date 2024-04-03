const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, },
    userName: { type: DataTypes.STRING, allowNull: false },
    userLastName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
})

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const BasketProduct = sequelize.define('basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    // img: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    clothingType: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    image: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }
});
// const ProductImage = sequelize.define('product_image', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     productId: { type: DataTypes.INTEGER, allowNull: false },
//     imageUrl: { type: DataTypes.STRING, allowNull: false },
// }); 

// Product.hasMany(ProductImage);
// ProductImage.belongsTo(Product); 


const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Brand = sequelize.define('brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
})

const ProductInfo = sequelize.define('product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
})

const TypeBrand = sequelize.define('type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})


User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

Type.hasMany(Product)
// Product.belongsTo(Type)
Product.belongsTo(Type, { foreignKey: 'typeName', targetKey: 'name' });


Brand.hasMany(Product)
// Product.belongsTo(Brand)
Product.belongsTo(Brand, { foreignKey: 'brandName', targetKey: 'name' });
// Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand', targetKey: 'id', attributes: ['name'] });
// Product.belongsTo(Brand, {as: 'brand', attributes: ['name']});


Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(ProductInfo, { as: 'info' });
ProductInfo.belongsTo(Product)

Type.belongsToMany(Brand, { foreignKey: 'brandName', targetKey: 'name', through: TypeBrand })
Brand.belongsToMany(Type, { foreignKey: 'typeName', targetKey: 'name', through: TypeBrand })

// Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brandAssociation', targetKey: 'id', attributes: ['name'] });
// Product.belongsTo(Type, { foreignKey: 'typeId', as: 'typeAssociation', targetKey: 'id', attributes: ['name'] });

module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    Brand,
    Rating,
    TypeBrand,
    ProductInfo,
    //  ProductImage
}