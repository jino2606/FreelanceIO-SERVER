/* import jsonWebtoken jwt */
const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next)=>{
    console.log("Inside the middleware");

    /* Logics */
    const token = req.headers['authorization'].split(' ')[1] /* split the token as the token contains the word bearer and tokenString.  the split will convert it into array data where the 0 th index is string"Bearer"  and 1st index is thre string of token  */
    console.log(token);

    try {

        /* use the .verify method from the jwt and use the secrect key used while encrypt the token to decrypt it now */
        const verifyToken = jwt.verify(token, "mySecrectKeyForProject")
        console.log("verifyToken", verifyToken);
        
        /* add one field to incoming as userId and add the decrypted token in it to use it in the project controller to store the projectin the database*/
        req.userId = verifyToken.userId
        
        /* go to project controller */
        next()
        
    } catch (error) {
        res.status(401).json("Authorization failed.. Please Login Again")
    }
}

module.exports = jwtMiddleware