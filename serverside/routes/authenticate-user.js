const logic = require('../logic')

const { createToken } = require('../token-helper')

module.exports = (req, res) => {
    console.log(req.body)
    const { body: { email, password } } = req

    try {
        logic.authenticateUser(email, password)
            // .then(data => res.json(data))
            .then(userId => {
                const token = createToken(userId)

                res.json({ token })
            })
            .catch(({ message }) => {
                res.status(400).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(400).json({
            error: message
        })
    }
}