import pkg from 'sequelize';
import Joi from 'joi';
const { DataTypes, Sequelize } = pkg;
import {sequelize} from "./config.js";

export const User = sequelize.define(
  "user",
  {
    name:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
      },
    age:{
        type:DataTypes.INTEGER
    },
    date_of_birth:{
      type:DataTypes.DATE,
    }

  },
);


export function validateUser(user){
  const schema =Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().required().email(),
      age: Joi.number().integer().min(0),
      date_of_birth: Joi.date().iso(),
  });
  return schema.validate(user);
  }

export default {User,validateUser};