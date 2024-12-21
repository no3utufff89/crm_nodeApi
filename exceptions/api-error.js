export default class ApiError extends Error {
    constructor(status, message, errors = []) {
        
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        throw new ApiError(401, 'User not authorized');
    }
    static BadRequest(message, errors = []) {        
        throw new ApiError(400, message, errors);
    }
}