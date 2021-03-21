'use strict'

require('dotenv').config()
require('isomorphic-fetch')

const ObjectID = require('mongodb').ObjectID
const expect = require('expect')
const logic = require('.')
const bcrypt = require('bcrypt')
const TEST_DB_URL = "mongodb+srv://carlos:250894@cluster0.v8se2.mongodb.net/ioc?retryWrites=true&w=majority"
const { User } = require('../data') 
const mongoose = require('mongoose')


describe('logic', () => {
    before(() => mongoose.connect(TEST_DB_URL, { useNewUrlParser: true }))

    describe('register user', () => {
        const name = `AnInventedName-${Math.random()}`
        const surname = `AnInventedSurname-${Math.random()}`
        const email = `iocTest-${Math.random()}@mail.com`
        const password = `123-${Math.random()}Ab!`
        const passwordConfirm = password
        const type1 = "admin"
        const type2 = "rastreator"
        const phone = 987655555

        it('should throw Error on empty name', () =>
            expect(() => {
                logic.registerUser(null, surname, email, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty surname', () =>
            expect(() => {
                logic.registerUser(name, null, email, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )

        it('should throw Error on empty email', () =>
            expect(() => {
                logic.registerUser(name, surname, null, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )

        it('should throw Error on empty password', () =>
            expect(() => {
                logic.registerUser(name, surname, email, null, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on non-matching password', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, 'fgfhgfghfhfhfhh', type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty type', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, passwordConfirm, null, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty phone', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, passwordConfirm, type1, null)
            }).toThrow(Error)
        )

        it('should throw Error on non-number phone', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, passwordConfirm, type1, 'atring')
            }).toThrow(Error)
        )

        it('should throw Error on non-number phone', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, passwordConfirm, type1, 'atring')
            }).toThrow(Error)
        )

        it('should throw Error on non a valid user type', () =>
            expect(() => {
                logic.registerUser(name, surname, email, password, passwordConfirm, 'anothertpe', 6273737383838)
            }).toThrow(Error)
        )

        it('should throw Error on non a valid secure password', () =>
            expect(() => {
                logic.registerUser(name, surname, email, 'ainventednonconditionmatchingpasswotd', 'ainventednonconditionmatchingpasswotd', type1, phone)
            }).toThrow(Error)
        )

        it('should succeed on valid data', async () => {
            const id = await logic.registerUser(name, surname, email, password, passwordConfirm, type1, phone)
            expect(id).toBeDefined()
            expect(typeof id).toBe('string')
            const user = await User.findOne({ email })
            expect(user.name).toBe(name)
            expect(user.surname).toBe(surname)
            expect(user.email).toBe(email)
            const match = await bcrypt.compare(password, user.password)
            expect(match).toBeTruthy()
            const ok = await User.findOneAndDelete({ '_id' : id });
            expect(ok).toBeDefined()
        })
    })

    describe('authenticate user', () => {
        const name = 'IOC1'
        const surname = 'IOC2'
        const email = `IOC12234-${Math.random()}@mail.com`
        const password = `123-${Math.random()}Ab!`
        const type = 'admin'
        const phone = 6346368468683468743

        

        it('should fail on wrong credentials', async () => {

            try {
                const hash = await bcrypt.hash(password, 10)
            
                const userToTest = await User.create({ name, surname, email, password: hash, type, phone })
    
                const badAuth = await logic.authenticateUser(email, 'inventedpassword-non-encrypted')

            } catch(err) {
                expect(err).toBeDefined()
                const ok = await User.findOneAndDelete({email})
                expect(ok).toBeDefined()
            }
            
        })


        it('should succeed on correct credentials', async () => {

            const hash = await bcrypt.hash(password, 10)
            
            const userToTest = await User.create({ name, surname, email, password: hash, type, phone })
            logic.authenticateUser(email, password)
                .then(id => {
                    return User.findById(id)
                    .then(user => {
                        expect(user.id).toBe(id)
                        expect(id).toBeDefined()
                        expect(user.name).toBe(name)
                        expect(user.surname).toBe(surname)
                        expect(user.email).toBe(email)
                    })
                })


            const ok = await User.findOneAndDelete({'_id': userToTest._id})
            expect(ok).toBeDefined()
        })

        it('should fail on non-found user', () =>
            expect(() => {
                logic.authenticateUser(`iiioooooccccc-${Math.random()}@mail.com`, `123-${Math.random()}`)
                .catch(error => expect(error).toBeDefined())
            })
        )

        it('should throw Error on empty user', () =>
            expect(() => {
                logic.authenticateUser('', password)
            }).toThrow(Error)
        )

        it('should throw Error on non-string user', () =>
            expect(() => {
                logic.authenticateUser(true, password)
            }).toThrow(Error)
        )


        it('should throw Error on empty password', () =>
            expect(() => {
                logic.authenticateUser(email, '')
            }).toThrow(Error)
        )


        it('should throw Error on non-string password', () =>
            expect(() => {
                logic.authenticateUser(email, true)
            }).toThrow(Error)
        )
    
    })

    describe('retrieve user', () => {
        const name = 'IOC1'
        const surname = 'IOC2'
        const email = `IOC12234-${Math.random()}@mail.com`
        const password = `123-${Math.random()}Ab!`
        const type = 'admin'
        const phone = 6346368468683468743

        

        it('should retrieve user', async () => {

            try {
                const hash = await bcrypt.hash(password, 10)
            
                const userToTest = await User.create({ name, surname, email, password: hash, type, phone })

                const goodAuth = await logic.retrieveUser(userToTest._id.toString())

                expect(goodAuth).toBeDefined();

                const ok = await User.findOneAndDelete({'_id' : userToTest._id })

            } catch(err) {
                expect(err).not.toBeDefined()
                
                expect(ok).toBeDefined()
            }
            
        })


        it('should fail on retrieve user', async () => {

            try {
                const hash = await bcrypt.hash(password, 10)
            
                const userToTest = await User.create({ name, surname, email, password: hash, type, phone })

                const badAuth = await logic.retrieveUser(userToTest._id)

            } catch(err) {
                expect(err).toBeDefined()
                
                const ok = await User.findOneAndDelete({email})
                expect(ok).toBeDefined()
            }
            
        })


    })


    describe('register user', () => {
        const name = `AnInventedName-${Math.random()}`
        const surname = `AnInventedSurname-${Math.random()}`
        const email = `iocTest-${Math.random()}@mail.com`
        const password = `123-${Math.random()}Ab!`
        const passwordConfirm = password
        const type1 = "admin"
        const type2 = "rastreator"
        const phone = 987655555

        it('should throw Error on empty name', () =>
            expect(() => {
                logic.updateUser(null, surname, email, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty surname', () =>
            expect(() => {
                logic.updateUser(name, null, email, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )

        it('should throw Error on empty email', () =>
            expect(() => {
                logic.updateUser(name, surname, null, password, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )

        it('should throw Error on empty password', () =>
            expect(() => {
                logic.updateUser(name, surname, email, null, passwordConfirm, type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on non-matching password', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, 'fgfhgfghfhfhfhh', type1, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty type', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, passwordConfirm, null, phone)
            }).toThrow(Error)
        )
        it('should throw Error on empty phone', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, passwordConfirm, type1, null)
            }).toThrow(Error)
        )

        it('should throw Error on non-number phone', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, passwordConfirm, type1, 'atring')
            }).toThrow(Error)
        )

        it('should throw Error on non-number phone', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, passwordConfirm, type1, 'atring')
            }).toThrow(Error)
        )

        it('should throw Error on non a valid user type', () =>
            expect(() => {
                logic.updateUser(name, surname, email, password, passwordConfirm, 'anothertpe', 6273737383838)
            }).toThrow(Error)
        )

        it('should throw Error on non a valid secure password', () =>
            expect(() => {
                logic.updateUser(name, surname, email, 'ainventednonconditionmatchingpasswotd', 'ainventednonconditionmatchingpasswotd', type1, phone)
            }).toThrow(Error)
        )

        it('should succeed on valid data', async () => {
            const id = await logic.registerUser(name, surname, email, password, passwordConfirm, type1, phone)
            expect(id).toBeDefined()
            expect(typeof id).toBe('string')
            const user = await User.findOne({ email })
            expect(user.name).toBe(name)
            expect(user.surname).toBe(surname)
            expect(user.email).toBe(email)
            const match = await bcrypt.compare(password, user.password)
            expect(match).toBeTruthy()

            const newName = 'a-new-name'
            const newSurname = 'a-new-surname'
            const newPhone = Math.floor(Math.random() * (10000000 - 1)) + 1;
            const id2 = await logic.updateUser(newName, newSurname, email, password, passwordConfirm, type1, newPhone)
            expect(id2).toBeDefined()
            const user2 = await User.findOne({ email })
            expect(user2.name).toBe(newName)
            expect(user2.surname).toBe(newSurname)
            expect(user2.email).toBe(email)
            expect(user2.phone).toBe(newPhone)


            const ok = await User.findOneAndDelete({ email});
            expect(ok).toBeDefined()
        })


        it('should succeed on valid data', async () => {
            
            try{
                const id = await logic.registerUser(name, surname, email, password, passwordConfirm, type1, phone)
                expect(id).toBeDefined()
                expect(typeof id).toBe('string')
                const user = await User.findOne({ email })
                expect(user.name).toBe(name)
                expect(user.surname).toBe(surname)
                expect(user.email).toBe(email)
                const match = await bcrypt.compare(password, user.password)
                expect(match).toBeTruthy()
    
                const newName = 'a-new-name'
                const newSurname = 'a-new-surname'
                const newEmail = `iocTest-new-${Math.random()}@mail.com`
                const newPhone = Math.floor(Math.random() * (10000000 - 1)) + 1;
                const id2 = await logic.updateUser(newName, newSurname, newEmail, password, passwordConfirm, type1, newPhone)
            } catch(err){
                expect(err).toBeDefined()
                const ok = await User.findOneAndDelete({email});
                expect(ok).toBeDefined()
            }
            

            
        })
    })

   
})