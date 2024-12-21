import jwt from 'jsonwebtoken';
import { knex } from '../connectDataBase.js';

class TokenService {
    generateTokens(payload) {
        //Сгенерировать токены
        const accsessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });
        return {
            accsessToken,
            refreshToken,
        }
    }
    async saveToken(id, refreshToken) {
      //Сохранить токены в БД
      const tokenData = await knex('user_profile')
       .where({id: id}).first()
      if(tokenData) {
        await knex('user_profile').where({ id: id }).update({ refresh_token: refreshToken });
      } else {
        await knex('user_profile').insert({ id: id, refresh_token: refreshToken });
      }
    }
    async removeToken(refreshToken) {
      if(!refreshToken) {
        return;
        
      }
      const tokenData = await knex('user_profile').where({refresh_token: refreshToken}).first();
      if(tokenData) {
        await knex('user_profile').where({ id: tokenData.id }).update({ refresh_token: null });
      }

      return tokenData;
    }

    validateAccessToken(token) {
      try {
         const userdata = jwt.verify(token, process.env.SECRET);
         return userdata;
      } catch (error) {
        return null;
      }
    }
    validateRefreshToken(token) {
      
      
      try {
         const userdata = jwt.verify(token, process.env.SECRET);
         console.log(`validate refresh token`, userdata);
         
         return userdata;
      } catch (error) {
        return null;
      }
    }

   async findToken(refreshToken) {
    console.log(`find token`, refreshToken);
    
       const tokenData = await knex('user_profile').where({ refresh_token: refreshToken }).first();
       return tokenData;
    }
}
export default new TokenService();