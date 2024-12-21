export default class UserDto {
    id;
    firstName;
    lastName;
    login;
    role;
    constructor(model) {
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.login = model.login;
        this.role = model.role;
    }
}