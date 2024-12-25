const errorMiddleware=(err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "error from backend";
    return res.status(status).json({
        message:message
    })
}
module.exports=errorMiddleware