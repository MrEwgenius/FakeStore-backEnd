const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    userName: { type: DataTypes.STRING, allowNull: false },
    userLastName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    adress: { type: DataTypes.STRING, allowNull: true },
    userNumber: { type: DataTypes.STRING, allowNull: true },
});

const Basket = sequelize.define("basket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define("basket_product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sizeBasketProduct: { type: DataTypes.STRING, allowNull: false },
});

const Product = sequelize.define("product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    gender: { type: DataTypes.STRING, allowNull: false },
    clothingType: { type: DataTypes.STRING, allowNull: true },
    size: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    image: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
});

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING, defaultValue: "Processing" },
});

Order.belongsTo(User); // Заказ принадлежит определенному пользователю
User.hasMany(Order); // Пользователь может иметь много заказов

const OrderProduct = sequelize.define("order_product", {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // Количество продуктов в заказе
    size: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false }, // Цена продукта в момент заказа
});

// Ассоциации между заказом и продуктом через промежуточную таблицу
Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: "orderId", // Связывает с Order
});

Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: "productId", // Связывает с Product
});

const Type = sequelize.define("type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define("brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
});

const ProductInfo = sequelize.define("product_info", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define("type_brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Type.hasMany(Product);
// Product.belongsTo(Type)
Product.belongsTo(Type, { foreignKey: "typeName", targetKey: "name" });

Brand.hasMany(Product);
// Product.belongsTo(Brand)
Product.belongsTo(Brand, { foreignKey: "brandName", targetKey: "name" });

Product.hasMany(Rating);
Rating.belongsTo(Product);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(ProductInfo, { as: "info" });
ProductInfo.belongsTo(Product);

Type.belongsToMany(Brand, {
    foreignKey: "brandName",
    targetKey: "name",
    through: TypeBrand,
});
Brand.belongsToMany(Type, {
    foreignKey: "typeName",
    targetKey: "name",
    through: TypeBrand,
});

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
    Order,
    OrderProduct,

    //  ProductImage
};
