const logic = require('../logic')

module.exports = (req, res) => {
    const { params: { pacientid }} = req
    console.log(pacientid)
    try {
        logic.getPacientDetail(pacientid)
            .then(pacient => {
                res.json(pacient)
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