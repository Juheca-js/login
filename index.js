
//simplemente importa la biblioteca ó inicializa express  
const express = require('express');

const cript= require ('bcrypt'); 

//importo las funcionalidades de la base de datos. Este código importa la biblioteca mongodb-legacy y lo guarda en la variable mongodb. mongodb-legacy es una biblioteca que proporciona una interfaz para trabajar con bases de datos
const mongodb = require('mongodb-legacy')

//inicializar el servidor 
const app = express()

//crear el objeto mongocliente
const MongoClient = mongodb.MongoClient

//conecto con la base de datos mongodb
MongoClient.connect('mongodb://127.0.0.1:27017', (error, client)=>{
    if(error != undefined){
        throw new Error(error)
    } else {
        console.log('connected to Database')
        app.locals.db = client.db("reguistro")
    }
})

//escucha el puerto
app.listen(3000, ()=>{
    console.log("Escuchando en el 3000")
})

//esta línea de código permite que los archivos estáticos se sirvan rápidamente desde el servidor, mejorando la velocidad y la eficiencia del sitio web.
app.use(express.static('public'))

//Este código permite que Express pueda entender y procesar datos de formularios HTML que son enviados a través de una solicitud POST
app.use (express.urlencoded({extended: false}))
app.use(express.json())


app.post('/register', (req, res)=>{
    req.body.password = cript.hashSync(req.body.password,10)
    app.locals.db.collection('register').insertOne(req.body, (err, data)=>{
        if(err !== undefined){
            console.log(err)
        } else {
            res.send(data)
        }
    })
})


app.post('/login', (req, res)=>{
    app.locals.db.collection('register').findOne({username: req.body.username}, (err, data)=>{
        if(err !== undefined){
            console.log(err)
        } else {
            cript.compareSync(req.body.password, data.password) ? res.send ('Bienvenido estas logeado') : res.send('las liao')
        }
    })
})

