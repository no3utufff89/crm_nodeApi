import { knex } from "../connectDataBase.js";
import bcrypt from 'bcryptjs';

import tokenService from "./token-service.js";
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

class UserService {
    //Метод регистрации нового пользователя
    async registration(login, password,firstName, lastName) {

        //Проверяем существование пользователя
        const userExists = await knex('user_profile').where({ login: login }).first()
        //Если существует -> Ошибка
        if (userExists) {
          throw ApiError.BadRequest('User already exists', );
        }
        if(!firstName || !lastName || !password || !login) {
            throw ApiError.BadRequest('All fields are required');
        }
        //Кодируем пароль пользователя
        const hashedPassword = await bcrypt.hash(password, 5);
        //Создаем нового пользователя
        const newUser = await knex('user_profile').insert({
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: hashedPassword,
            role_id: 2
        }).returning('*');
               
        if (!newUser[0]) {
            throw ApiError.BadRequest('Invalid user data');
        }
        //Создаем DTO для передачи пользовательской информации
        const userDto = new UserDto(newUser[0]);        
        
        //Генерируем и сохраняем токены для авторизации
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {message: 'User created successfully', user: userDto, ...tokens, stutus: 201};
    }
    
    //Метод авторизации пользователя
    async login(login, password) {
        //Получаем пользователя по логину
        // const user = await knex('user_profile').where({ login: login }).first();
        const user = await knex('user_role')
      .where({ login: login }).first()
        .join('user_profile', 'user_role.id','user_profile.role_id')
        .select(
          'user_profile.id',
          'user_role.user_role_name as role',
          'user_profile.login as login',
          'user_profile.firstName as firstName',
          'user_profile.lastName as lastName',
          'user_profile.password as password',
        );
        //Если пользователь не найден -> Ошибка
        if (!user) {
            throw ApiError.BadRequest('Login Error', {
                userNameError: 'No user with such name'
            });
        }
        //Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        //Если пароли не совпадают -> Ошибка
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Invalid password', {
                passwordError: 'Invalid password'
            });
        }
        //Создаем DTO для передачи пользовательской информации
        const userDto = new UserDto(user);
        console.log(`userDto`, userDto);
        
        //Генерируем и сохраняем токены для авторизации
        const tokens = tokenService.generateTokens({...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto };
    }

    //Метод получения информации о пользователе по токену
    // async getUserByToken(token) {
    //     //Декодируем токен
    //     const decodedData = jwt.verify(token, process.env.SECRET);
    //     //Получаем пользователя по id
    //     const user = await knex('user_profile').where({ id: decodedData.id }).first();
    //     //Если пользователь не найден -> Ошибка
    //     if (!user) {
    //         throw ApiError.BadRequest('No such user');
    //     }
    //     //Создаем DTO для передачи пользовательской информации
    //     const userDto = new UserDto(user);
    //     return userDto;
    // }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refreshToken(refreshToken) {
        console.log(`refreshToken1111`, refreshToken);
        
        //Проверяем существование токена
        if(!refreshToken) {
            throw ApiError.UnauthorizedError('Invalid refresh token');
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFronDB = tokenService.findToken(refreshToken);
        if(!tokenFronDB || !userData) {
            throw ApiError.UnauthorizedError('Invalid refresh token!!!!');
        }
        //user
        const userToRefresh = await knex('user_profile').where({id: userData.id}).first();
        const user = await knex('user_role')
        .where({login: userToRefresh.login}).first()
        .join('user_profile', 'user_role.id','user_profile.role_id')
        .select(
            'user_profile.id',
            'user_role.user_role_name as role',
            'user_profile.login as login',
            'user_profile.firstName as firstName',
            'user_profile.lastName as lastName',
            'user_profile.password as password',
          );
        const userDto = new UserDto(user);
        console.log(`refresuUSER`, user);
        
        console.log(`refresh DTO`, userDto);
        
        const tokens = tokenService.generateTokens({...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return {...tokens, user: userDto };
    }

}
export default new UserService();