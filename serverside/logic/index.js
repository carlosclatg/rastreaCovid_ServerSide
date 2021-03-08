'use strict'

const { User} = require('../data/index')
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID
const { AuthError, EmptyError, DuplicateError, MatchingError, NotFoundError } = require('../errors')

/**
 * Abstraction of business logic.
 */
const logic = {
    /**
    * Registers a user.
    * 
    * @param {string} name 
    * @param {string} surname 
    * @param {string} email 
    * @param {string} password 
    * @param {string} passwordConfirmation 
    */

    //Tested 28-02 with Postman
    registerUser(name, surname, email, password, passwordConfirmation, type) {
        if (typeof name !== 'string') throw TypeError(name + ' is not a string')

        if (!name.trim().length) throw new EmptyError('name cannot be empty')

        if (typeof surname !== 'string') throw TypeError(surname + ' is not a string')

        if (!surname.trim().length) throw new EmptyError('surname cannot be empty')

        if (typeof email !== 'string') throw TypeError(email + ' is not a string')

        if (!email.trim().length) throw new EmptyError('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')

        if (!password.trim().length) throw new EmptyError('password cannot be empty')

        if (typeof passwordConfirmation !== 'string') throw TypeError(passwordConfirmation + ' is not a string')

        if (!passwordConfirmation.trim().length) throw new EmptyError('password confirmation cannot be empty')

        if (password !== passwordConfirmation) throw new MatchingError('passwords do not match')

        if (typeof type !== 'string') throw TypeError(type + ' is not a string')

        if (!type.trim().length) throw new EmptyError('type cannot be empty')

        if (type !== 'admin' && type !== 'rastreator') throw TypeError(type + ' is not a valid type')

        return (async () => {
            const user = await User.findOne({ email })

            if (user) throw new DuplicateError(`user with email ${email} already exists`)

            const hash = await bcrypt.hash(password, 10)

            const { id } = await User.create({ name, surname, email, type , password: hash })

            return id
        })()
    },

    /**
     * Authenticates user by its credentials.
     * 
     * @param {string} email 
     * @param {string} password 
     */

    //TESTED MANUALLY 28-02 POSTMAN
    authenticateUser(email, password) {
        if (typeof email !== 'string') throw TypeError(email + ' is not a string')

        if (!email.trim().length) throw new EmptyError('email cannot be empty')

        if (typeof password !== 'string') throw TypeError(password + ' is not a string')

        if (!password.trim().length) throw new EmptyError('password cannot be empty')

        return (async () => {
                const user = await User.findOne({ email })          
                const match = await bcrypt.compare(password, user.password)
                if (!match) throw new AuthError('wrong credentials')
                
                return user.id
        })()
    },

    /**
     * Retrieves a user by userId
     * 
     * @param {String} userId 
     */
    retrieveUser(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        if (!userId.trim().length) throw new EmptyError('user id is empty')

        return User.findById(userId).select('-password -__v').lean()
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${userId} not found`)

                user.id = user._id.toString()
                delete user._id

                return user
            })
    },

    /**
     * Updates user-related fields in DB.
     * 
     * @param {String} name 
     * @param {String} surname 
     * @param {String} email 
     * @param {String} password 
     * @param {String} passwordConfirmation 
     */

    updateUser(name, surname, email, password, passwordConfirmation){
        if (typeof name !== 'string') throw TypeError(name + ' is not a string')
        if (!name.trim().length) throw new EmptyError('name cannot be empty')
        if (typeof surname !== 'string') throw TypeError(surname + ' is not a string')
        if (!surname.trim().length) throw new EmptyError('surname cannot be empty')
        if (typeof email !== 'string') throw TypeError(email + ' is not a string')
        if (!email.trim().length) throw new EmptyError('email cannot be empty')
        if (typeof password !== 'string') throw TypeError(password + ' is not a string')
        if (!password.trim().length) throw new EmptyError('password cannot be empty')
        if (typeof passwordConfirmation !== 'string') throw TypeError(passwordConfirmation + ' is not a string')
        if (!passwordConfirmation.trim().length) throw new EmptyError('password confirmation cannot be empty')
        if (password !== passwordConfirmation) throw new MatchingError('passwords do not match')

        return (async () => {
            const hash = await bcrypt.hash(password, 10)
            const user = await User.findOneAndUpdate({email}, {$set:{name, surname, 'password': hash}}, {new : true})
            return user
        })()
    }
    
}

module.exports = logic

