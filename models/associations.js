import { UserModel } from './UserModel.js';
import { TypeUsersModel } from './TypeUsersModel.js';
import { OrderModel } from './OrderModel.js';
import { ProductModel } from './ProductModel.js';
import { OrderDetailModel } from './OrderDetailModel.js';

// 1️⃣ RELACIÓN: TypeUser -> User (Uno a Muchos)
TypeUsersModel.hasMany(UserModel, {
  foreignKey: 'typeusers_id',
  sourceKey: 'id'
});

UserModel.belongsTo(TypeUsersModel, {
  foreignKey: 'typeusers_id',
  targetKey: 'id'
});

// 2️⃣ RELACIÓN: User -> Order (Uno a Muchos)
UserModel.hasMany(OrderModel, {
  foreignKey: 'userId',
  sourceKey: 'id'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  targetKey: 'id'
});

// 3️⃣ RELACIÓN: Order -> Product (Muchos a Muchos a través de OrderDetail)
OrderModel.belongsToMany(ProductModel, {
  through: OrderDetailModel,
  foreignKey: 'orderId',
  otherKey: 'productId'
});

ProductModel.belongsToMany(OrderModel, {
  through: OrderDetailModel,
  foreignKey: 'productId',
  otherKey: 'orderId'
});

// 4️⃣ RELACIONES DIRECTAS con OrderDetail (Opcional, para consultas más específicas)
OrderModel.hasMany(OrderDetailModel, {
  foreignKey: 'orderId',
  sourceKey: 'id'
});

OrderDetailModel.belongsTo(OrderModel, {
  foreignKey: 'orderId',
  targetKey: 'id'
});

ProductModel.hasMany(OrderDetailModel, {
  foreignKey: 'productId',
  sourceKey: 'id'
});

OrderDetailModel.belongsTo(ProductModel, {
  foreignKey: 'productId',
  targetKey: 'id'
});

console.log('✅ Todas las relaciones han sido definidas correctamente');