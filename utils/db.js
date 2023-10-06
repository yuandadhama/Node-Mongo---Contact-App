const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})

// menambah satu data 
// const contact1 = new Contact({
//    nama: 'Yuand',
//    nohp: '0882123456',
//    email: 'dhama@gmail.com'
// })

// // simpan ke collection
// contact1.save().then(contact => {
//    console.log(contact)
// });
