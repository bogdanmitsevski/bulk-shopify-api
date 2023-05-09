'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class handles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  handles.init({
    handle: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'handles',
    modelName: 'handles',
  });
  return handles;
};