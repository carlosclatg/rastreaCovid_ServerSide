require('dotenv').config()
require('isomorphic-fetch')

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const tokenHelper = require('./token-helper')
const { tokenVerifierMiddleware } = tokenHelper
const logsMiddleware = require('./middlewares/authorizationmd/LogMiddleware')
const verifyAuth = require('./middlewares/authorizationmd/AuthMiddleware')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const DB_URL = "mongodb+srv://carlos:250894@cluster0.v8se2.mongodb.net/ioc?retryWrites=true&w=majority"
const JWT_SECRET = "MYSECRET"
const PORT = 8080

const { registerUser, 
    authenticateUser, 
    updateUser, 
    retrieveUser,
    addPacient,
    retrieveSintoms,
    getAllPacients,
    getPacientDetail,
    getContactsByPacientId,
    deletePacientById
 } = require('./routes')

 const getContacts = 'getContacts'
 const getPacients = 'getPacients'
 const createPacient = 'createPacient'
 const getSintoms = 'getSintoms'
 const deletePacient = 'deletePacient'

mongoose.connect(DB_URL, { useNewUrlParser: true,  useFindAndModify: false  })
    .then(() => {
        tokenHelper.jwtSecret = JWT_SECRET //Initialize key for token
        const app = express() //Express server
        const jsonBodyParser = bodyParser.json() //Bodyparser for body
        const router = express.Router() //router

        app.use(express.json({limit: '50mb'})); //Set more limit to size because otherwise it refuses size = 1MB
        app.use(express.urlencoded({limit: '50mb'}));
        app.use('/api', router)
        router.use(cors()) //Para el Cors, evita el bloqueo del navegador por seguridad cuando hace llamadas a diferentes URLs.
        //Faltará implementar middlewares de authorization que puede requerir llamar a BD.

        //doc
        router.use('/api-docs', swaggerUi.serve);
        router.get('/api-docs', swaggerUi.setup(swaggerDocument));

        //user
        router.post('/user', jsonBodyParser, registerUser)
        router.post('/user/auth', jsonBodyParser, authenticateUser)
        router.put('/user/update', jsonBodyParser, updateUser)
        router.get('/retrieveuser', [tokenVerifierMiddleware], retrieveUser)

        //pacients and contacts
        router.post('/pacient', [jsonBodyParser, tokenVerifierMiddleware, logsMiddleware(createPacient), verifyAuth(createPacient)], addPacient)
        router.get('/pacients', [tokenVerifierMiddleware, logsMiddleware(getPacients), verifyAuth(getPacients)], getAllPacients)
        router.get('/pacient/:pacientid', [tokenVerifierMiddleware, logsMiddleware(getPacients), verifyAuth(getPacients)], getPacientDetail)
        router.get('/contacts/:pacientid', [tokenVerifierMiddleware, logsMiddleware(getContacts), verifyAuth(getContacts)], getContactsByPacientId )
        router.delete('/pacient/:pacientid', [tokenVerifierMiddleware, logsMiddleware(deletePacient), verifyAuth(deletePacient)], deletePacientById)

        //Sprint4 --> Editar una vez creado el pacient la lista de contactos (añadir y eliminar) y el propio paciente


        //sintoms eng, cat, es
        router.get('/sintoms/:lang', [jsonBodyParser, tokenVerifierMiddleware, verifyAuth(getSintoms)], retrieveSintoms)

        app.listen(PORT, () => console.log(`running on port ${PORT}`))
    })
    .catch(console.error)