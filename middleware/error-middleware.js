import ApiError from "../exceptions/api-error.js";

export const errMiddleware = (err,req,res,next) => {    
    if (err instanceof ApiError) {        
        return res.status(err.status).json({message: err.message, errors: err.errors, status: err.status})
    }
    return res.stutus(500).json({message: 'Unexpected error'})
}


