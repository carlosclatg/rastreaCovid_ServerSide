const { Logs } = require("../data")

module.exports = (req, res, next)  => {
    userId = req.userId
    try{
        Logs.create({userId, operation: "retrieve user info"}).then(res=> res)
        .catch(({ message }) => {
            console.log(message)
        })
    
    } catch(err) {
        console.err(err)
    }
    next() 
}
