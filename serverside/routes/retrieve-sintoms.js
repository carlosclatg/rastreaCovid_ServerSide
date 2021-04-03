const logic = require('../logic')

module.exports = (req, res) => {
    const { params: { lang }} = req
    console.log(req.params)
    //registerPacient(name, surname, phone, bdate, PcrDate, arrayOfContacts, sintoms, userId)
    try {
        logic.getSintoms(lang)
            .then(sintoms => {
                res.json(sintoms)
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