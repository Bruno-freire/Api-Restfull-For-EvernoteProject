const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://0.0.0.0/javascriptNote', { useNewUrlParser: true, useUnifiedTopology: true,   autoIndex: true})
.then(() => console.log('Conectado ao mongoDB'))
.catch((err) => {console.log(err.message)})