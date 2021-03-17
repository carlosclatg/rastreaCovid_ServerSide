'use strict'

require('dotenv').config()
require('isomorphic-fetch')

const ObjectID = require('mongodb').ObjectID
const expect = require('expect')
const logic = require('.')
const bcrypt = require('bcrypt')
const TEST_DB_URL = 'mongodb://localhost/skylab-test'



describe('logic', () => {
    //before(() => mongoose.connect(TEST_DB_URL, { useNewUrlParser: true }))

    describe('register user', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const email = `manuelbarzi-${Math.random()}@mail.com`
        const password = `123-${Math.random()}`
        const passwordConfirm = password

        it('should succeed on valid data', async () => {
            const id = await logic.registerUser(name, surname, email, password, passwordConfirm)
            expect(id).toBeDefined()
            expect(typeof id).toBe('string')
            const user = await User.findOne({ email })
            expect(user.name).toBe(name)
            expect(user.surname).toBe(surname)
            expect(user.email).toBe(email)
            const match = await bcrypt.compare(password, user.password)
            expect(match).toBeTruthy()
        })

        it('should fail on already existing email', async () => {
            try {
                const id = await logic.registerUser(name, surname, email, password, passwordConfirm)
                expect(id).toBeDefined()
                expect(typeof id).toBe('string')
                const user = await User.findOne({ email })
                expect(user.name).toBe(name)
                expect(user.surname).toBe(surname)
                expect(user.email).toBe(email)
                const match = await bcrypt.compare(password, user.password)
                expect(match).toBeTruthy()
                const id2 = await logic.registerUser(name, surname, email, password, passwordConfirm)
            } catch (error) {
                expect(error).toBeDefined()
            }
        })

        it('should fail on undefined name', () => {
            const name = undefined
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(name + ' is not a string'))
        })

        it('should fail on numeric name', () => {
            const name = 10
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(name + ' is not a string'))
        })


        it('should fail on boolean name', () => {
            const name = true
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(name + ' is not a string'))
        })

        it('should fail on object name', () => {
            const name = {}
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(name + ' is not a string'))
        })

        it('should fail on array name', () => {
            const name = []
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(name + ' is not a string'))
        })

        it('should fail on empty name', () => {
            const name = ''
            const surname = 'Barzi'
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(Error('name cannot be empty'))
        })

        it('should fail on undefined surname', () => {
            const name = 'Manuel'
            const surname = undefined
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(surname + ' is not a string'))
        })

        it('should fail on numeric surname', () => {
            const name = 'Manuel'
            const surname = 10
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(surname + ' is not a string'))
        })


        it('should fail on boolean surname', () => {
            const name = 'Manuel'
            const surname = false
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(surname + ' is not a string'))
        })

        it('should fail on object surname', () => {
            const name = 'Manuel'
            const surname = {}
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(surname + ' is not a string'))
        })

        it('should fail on array surname', () => {
            const name = 'Manuel'
            const surname = []
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(TypeError(surname + ' is not a string'))
        })

        it('should fail on empty surname', () => {
            const name = 'Manuel'
            const surname = ''
            const email = 'manuelbarzi@mail.com'
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(Error('surname cannot be empty'))
        })

        it('should fail on empty email', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = ''
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(Error)
        })

        it('should fail on non-string email', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = true
            const password = `123-${Math.random()}`

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(Error)
        })

        it('should fail on empty password', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = 'manue@mail.com'
            const password = ''

            expect(() => {
                logic.registerUser(name, surname, email, password, 'password')
            }).toThrow(Error)
        })

        it('should fail on non-string password', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = 'manue@mail.com'
            const password = ''

            expect(() => {
                logic.registerUser(name, surname, email, password, password)
            }).toThrow(Error)
        })

        it('should fail on non-matching password and password confirmation', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = 'manue@mail.com'
            const password = '1234567-invented'

            expect(() => {
                logic.registerUser(name, surname, email, password, 'password')
            }).toThrow(Error)
        })
    })

    describe('authenticate user', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        const email = `manuelbarzi-${Math.random()}@mail.com`
        const password = `123-${Math.random()}`

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(hash => User.create({ name, surname, email, password: hash }))
        )

        it('should fail on wrong credentials', () => {
            (async () => {
                return await logic.authenticateUser(email, 'inventedpassword')
            })()
                .catch(error => {
                    expect(error).toBeDefined()
                })
        })

        it('should succeed on correct credentials', () =>
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
        )

        it('should fail on non-found user', () =>
            expect(() => {
                logic.authenticateUser(`manuelbarzi-${Math.random()}@mail.com`, `123-${Math.random()}`)
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
        const name = 'Manuel'
        const surname = 'Barzi'
        const email = `manuelbarzi-${Math.random()}@mail.com`
        const password = `123-${Math.random()}`
        let userId
        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(hash => User.create({ name, surname, email, password: hash }))
                .then(({ id }) => userId = id)
        )
        it('should succeed on correct credentials', () =>
            logic.retrieveUser(userId)
                .then(user => {
                    expect(user.id).toBe(userId)
                    expect(user.name).toBe(name)
                    expect(user.surname).toBe(surname)
                    expect(user.email).toBe(email)
                })
        )
        it('should throw Error on non-string userId', () =>
            expect(() => {
                logic.retrieveUser(true)
            }).toThrow(Error)
        )

        it('should throw Error on empty userId', () =>
            expect(() => {
                logic.retrieveUser('')
            }).toThrow(Error)
        )

        describe('update user', () => {
            const name = 'Manuel'
            const surname = 'Barzi'
            const email = `manuelbarzi-${Math.random()}@mail.com`
            const password = `123-${Math.random()}`
            let userId

            it('should succeed on correct credentials', () =>{
                bcrypt.hash(password, 10)
                .then(hash => User.create({ name, surname, email, password: hash }))
                .then(() => {
                    let newPassword = 'abc'
                    logic.updateUser('Carlos', 'Calvo', email,newPassword, newPassword )
                        .then(user => {
                            expect(user.name).toBe('Carlos')
                            expect(user.surname).toBe('Calvo')
                            expect(user.email).toBe(email)
                        })
                })
            })

            it('should fail on empty name', () =>{
                expect(() => {
                    let name1 = ''
                    let surname1 = 'Calvo'
                    let email1 = 'carlos@mail.com'
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })
            it('should fail on non-string name', () =>{
                expect(() => {
                    let name1 = true
                    let surname1 = 'Calvo'
                    let email1 = 'carlos@mail.com'
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })

            it('should fail on empty surname', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = ''
                    let email1 = 'carlos@mail.com'
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })
            it('should fail on non-string surname', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = {}
                    let email1 = 'carlos@mail.com'
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })

            it('should fail on empty email', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = 'Calvo'
                    let email1 = ''
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })
            it('should fail on non-string email', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = 'Calvo'
                    let email1 = {}
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })

            it('should fail on empty password', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = 'Calvo'
                    let email1 = 'carlos@mail.com'
                    let password1 = ''
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })

            it('should fail on non-string password', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = 'Calvo'
                    let email1 = 'carlos@mail.com'
                    let password1 = {}
                    logic.updateUser(name1, surname1, email1, password1, password1)
                }).toThrow(Error)
            })

            it('should fail on non-matching passwords', () =>{
                expect(() => {
                    let name1 = 'Carlos'
                    let surname1 = 'Calvo'
                    let email1 = 'carlos@mail.com'
                    let password1 = '12345abc'
                    logic.updateUser(name1, surname1, email1, password1, 'password1')
                }).toThrow(Error)
            })
        })
    })
})