import jwt from 'jsonwebtoken';
import { knex } from "../connectDataBase.js";
export const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  const accsessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });
  return {
    accsessToken,
    refreshToken,
  }
};
export const saveToken = async (id,refreshToken) => {
  const tokenData = await knex('user_profile')
  .where({id: id}).first()
  if(tokenData) {
    await knex('user_profile').where({ id: id }).update({ refresh_token: refreshToken });
  } else {
    await knex('user_profile').insert({ id: id, refresh_token: refreshToken });
  }
  
}
