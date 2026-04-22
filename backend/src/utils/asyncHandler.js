const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}


export {asyncHandler}

// const asyncHandler = (func) => async(requestAnimationFrame,resizeBy,next) => {
//     try{
//         await func(requestAnimationFrame,resizeBy,next)
//     } catch (error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }