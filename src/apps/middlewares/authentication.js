const {destroyedToken}=require ("../../utils/token");
const {decrypt} =require ("../../utils/crypt");



const verifyJwt = async (req,res,next) =>{
    const authHeader =req.headers.authorization;
if(!authHeader) {
    return res.status(401).json({message:"No token provided"})
}
try {
    const {userId} = await destroyedToken(authHeader);
    req.userId = parseInt(decrypt(userId));
    return next();
} catch (error) {
    console.log(error)
    return res.status(401).json({message:"Unauthorized!"})
}
}


module.exports = verifyJwt;