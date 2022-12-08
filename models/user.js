"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 좋아요, 댓글 들어가야 됨
    }
  }
  Users.init(
    {
      userId: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      email: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      createdAt: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },

    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
