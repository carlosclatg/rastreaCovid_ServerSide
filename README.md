# rastreaCovid_ServerSide
rastreaCovid



RUN:

Desde la carpeta del package.json

$ npm install

$ node index.js 

En los logs deberías ver que el server corre en el port 8080



EDNPOINTS:

- post('/api/user') --> Crear usuario, ver body1
- post('/api/user/auth') --> Auth devuelve token ver body2
- put ('/api/user/update') --> Update del usuario, ver body3

- body1: ejemplo
{
    "name": "Carlos",
    "surname": "Calvo",
    "email": "carloscl1986@gmail.com",
    "password": "250894",
    "passwordConfirm":"250894",
    "type": "rastreator"
}


- body2: ejemplo
{
    "email": "carloscl19862@gmail.com",
    "password": "250894"
}

-body3: ejemplo
{
    "name": "Carlos",
    "surname": "Calvo",
    "email": "carloscl19863456@gmail.com",
    "password": "kk",
    "passwordConfirm":"kk",
    "type": "rastreator"
}


Missing affinar los codigos http de respuesta para cada error.i