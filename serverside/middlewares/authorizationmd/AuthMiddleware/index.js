const { User, Permissions } = require("../../../data")
const {AuthError} = require('../../../errors/index')

module.exports = function verifyAuth(operation) {
    return async (req, res, next) => {
        try{

            userId = req.userId
            const user = await User.findById(userId)
            if(!user) res.status(401)
            const permissions = await Permissions.findOne({operation})

            if(!user.type)  {
                res.status(500); 
                throw new EmptyError()
            }

            if(user.type === 'admin'){
                if(!permissions.isAdminAllowed) {
                    throw new AuthError()
                }
            }

            if(user.type === 'rastreator'){
                if(!permissions.isRastreatorAllowed) {
                    throw new AuthError()
                } 
            }

            next()

        }catch(err){
            if(err instanceof AuthError){
                res.status(401).json({
                    error: "Not Authorized"
                })
            }

            if(err instanceof EmptyError){
                res.status(500).json({
                    error: "Not existing user"
                })
            }
        }
    };
};
