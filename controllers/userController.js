import userService from "../services/user-service.js";

class userController {
  // Метод регистрации нового пользователя
  async registration(req, res, next) {
    // Регистрация нового пользователя
    try {
      const { login, password, firstName, lastName } = req.body;
      const userData = await userService.registration( login, password, firstName, lastName);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json(userData);
    } catch (err) {
      next(err);
      
    }
  }
  
  // Метод авторизации
  async login(req, res, next) {
    // Авторизация пользователя
    try {
      const { login, password } = req.body;
      const userData = await userService.login(login, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json(userData);
    } catch (err) {
      next(err);
    }
}
  
  // Метод выхода из системы
  async logout(req, res, next) {
   try {
    const {refreshToken} = req.cookies;
    const token = userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json({message: 'Logged out', token: token});
   } catch (err) {
      next(err);
   }
  }

  async refreshToken(req, res, next) {
    console.log(`refreshLog`, req.cookies);
      try {
        const { refreshToken } = req.cookies;
        const userData = await userService.refreshToken(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
      } catch (err) {
        next(err);
      }
  }
}

export default new userController();