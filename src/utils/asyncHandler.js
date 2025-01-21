// const asyncHandler=(fun)=>async(req,res,next)=>{
//     try {
//         await fun(req,res,next)
//     } catch (error) {
//             res.status(error.code || 500).json({
//                 success:false,
//                 message:error.message
//             })
//     }
// }

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).cathc((error) =>
      next(error)
    );
  };
};

export { asyncHandler };
