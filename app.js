const express = require('express');
const expressLayouts = require('express-ejs-layouts');

require('./utils/db')
const Contact = require('./model/contact');

const app = express();
const port = 3000;

const { body, validationResult, check } = require('express-validator')

// setup method override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


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

// setup ejs
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
   console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});

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
   const contacts = await Contact.find();

   res.render('contact', {
      contacts,
      msg: req.flash('msg'),
   });
});

// tambah contact
app.get('/contact/add', (req, res) => {
   res.render('addcontact');
});

// proses tambah data contact
app.post('/contact', [
   body('nama').custom(async value => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
         throw new Error('nama sudah ada dalam daftar contacts');
      }
      return true;
   }),
   check('email', 'email tidak valid').isEmail(),
   check('nohp', 'noHP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      res.render('addcontact', { errors: errors.array() });
   } else {
      Contact.insertMany(req.body).then((result) => {
         req.flash('msg', 'data contact berhasil ditambahkan');
         res.redirect('/contact');
      });
   }
});

// hapus contact
app.delete('/contact', (req, res) => {
   Contact.deleteOne({ nama: req.body.nama }).then((result) => {
      req.flash('msg', 'data contact berhasil dihapus');
      res.redirect('/contact');
   });
})

// edit contact
app.get('/contact/edit/:nama', async (req, res) => {
   const contact = await Contact.findOne({ nama: req.params.nama });

   res.render('editcontact', { contact });
});

// proses edit contact
app.put('/contact', [
   body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });

      // jika value tidak sama yang lama dan duplikat
      if (value != req.body.oldName && duplikat) {
         throw new Error('nama sudah ada dalam daftar contacts');
      }
      return true;
   }),
   check('email', 'email tidak valid').isEmail(),
   check('nohp', 'noHP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      res.render('editcontact', {
         errors: errors.array(),
         contact: req.body
      });
   } else {
      Contact.updateOne(
         { _id: req.body._id },
         {
            $set: {
               nama: req.body.nama,
               email: req.body.email,
               nohp: req.body.nohp
            }
         }
      ).then( result => {
         req.flash('msg', 'data contact berhasil diedit');
         res.redirect('/contact');
      });
   }
});

// get data detail contact
app.get('/contact/:nama', async (req, res) => {
   const contact = await Contact.findOne({ nama: req.params.nama });

   res.render('detail', {
      contact,
   });
});