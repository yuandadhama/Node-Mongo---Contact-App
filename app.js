const express = require('express');
const expressLayouts = require('express-ejs-layouts');

require('./utils/db')
const Contact = require('./model/contact');

const app = express();
const port = 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// config flash
app.use(cookieParser('secret'))
app.use(session({
   cookie: { maxAge: 6000 },
   secret: 'secret',
   resave: true,
   saveUninitialized: true,
}));

app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
   console.log(`Mongo Contact App | listening at http://localhost:${port}`);
})

app.get('/', (req, res) => {
   const mahasiswa = [
      {
         nama: 'Dhama',
         email: 'dhama@gmail.com'
      },
      {
         nama: 'Yuan',
         email: 'yuan@gmail.com'
      },
      {
         nama: 'Dita',
         email: 'dita@gmail.com'
      },
   ]
   res.render('index', {
      nama: 'Dhama',
      title: 'Halaman Home',
      mahasiswa,
   });
});

// halaman about
app.get('/about', (req, res) => {
   res.render('about');
});

// halaman list contact
app.get('/contact', async (req, res) => {

   // Contact.find().then(contact => {
   //    res.send(contact);
   // })

   const contacts = await Contact.find();

   res.render('contact', {
      contacts,
      msg: req.flash('msg'),
   });
});

// get data detail contact
app.get('/contact/:nama', async (req, res) => {
   const contact = await Contact.findOne({ nama: req.params.nama });

   res.render('detail', {
      contact,
   });
});