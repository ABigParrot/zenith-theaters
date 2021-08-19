//imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false}))
app.use(express.json());

app.locals.movies = require('./movies.json');
//MySQL 

const con = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'tbehnz',
    password: 'Arr4ng3m3n7',
    database: 'zeniththeaters'
})


//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

//Navigation
app.get('/', (req, res) => {
    res.render('index', {title: 'Zenith Theaters'})
});

app.get('/my-theater', (req, res) => {

    //Can only use the GetConnection method for pools and not simple connections
    con.getConnection((err, con) => {
        if(err) throw err
        console.log(`Connected as ${con.threadId}`)
        
        con.query('SELECT * FROM markers', (err, rows) => {
            con.release();
            
            //-------------------DO NOT CHANGE--------------------------------------------------
            
            if(!err){
                res.render('my-theater', {title: 'My Theater', items: rows})
            }else {console.log(err.message)}

            //-------------------DO NOT CHANGE--------------------------------------------------
        });
    });
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About Zenith'})
})

app.get('/now-playing', (req, res) => {
    res.render('now-playing', {title: 'Now Playing', layout: './layouts/sidebar'})
})

//Listen on port 3000
app.listen(port, () => console.info(`Listneing on port ${port}`))
