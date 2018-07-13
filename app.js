const express = require('express')
const app = express()
const path = require('path')
const prefix = '/app'
const port = 3000
const {displayPictures} = require('./fetchPictures')
let server

server = require('http').createServer(app)
try {
    server.listen(port, ()=>{
        console.log("Started listenning on port: ", port)
    })
} catch (e) {
    console.log("Some error while running server", e)
}
app.use(prefix + '/kth-style', express.static(path.join(__dirname, '/node_modules/kth-style/dist')))
app.use(prefix + '/local-style', express.static(path.join(__dirname, '/style/')))
app.get(prefix + '/pictures', displayPictures)


server = require('http-shutdown')(server)

app.get(prefix + '/avbryt', (req, res) => {
    res.send('Finished application');
    res.end();
    server.shutdown(()=>console.log('Everything is cleanly shutdown.'))

})