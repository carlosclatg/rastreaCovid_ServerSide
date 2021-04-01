const { Logs } = require("../../../data")

module.exports = function logsMiddleware(operation) {
    return (req, res, next)  => {
        userId = req.userId
        try{
            Logs.create({userId, operation})
                .then(res=> res)
                .catch(({ message }) => {
                    console.log(message)
                })
        
        } catch(err) {
            console.err(err)
        }
        next() 
    }
}
