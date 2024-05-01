function asyncCatch(fn){
    return (req,res,next)=>{
        fn(req, res, next).catch((err)=>{
            console.log(err);
            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';
            
            if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'UAT') {
            return res.status(err.statusCode).json({
                status: err.status,
                error: err,
                message: err.message,
                statusCode:err.statusCode,
                stack: err.stack
            });
            }else if (process.env.NODE_ENV === 'production') {
                if (err.isOperational) {
                    return res.status(err.statusCode).json({
                    status: err.status,
                    message: err.message
                    });
                }
                // B) Programming or other unknown error: don't leak error details
                // 1) Log error
                // console.error('ERROR 💥', err);
                // 2) Send generic message
                return res.status(500).json({
                    status: 'error',
                    statusCode:500,
                    message: 'Something went very wrong!'
                });
            }
        })
    } 
}


module.exports = asyncCatch;