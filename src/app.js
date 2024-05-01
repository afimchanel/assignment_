const express = require('express');
const cors = require('cors');
const app = express();

const userRoute = require('./routes/userRoute');
const chaptersRoute = require('./routes/chaptersRoute');
const animeRoute = require('./routes/animeRoute');
const studioRoute = require('./routes/studioRoute');
const ApiKey = require('./middleware/ApiKey');


var whitelist = [process.env.WHITELIST]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true, }))
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else if (process.env.NODE_ENV === 'test') {
  app.use(cors(corsOptions));
} else if (process.env.NODE_ENV === 'production') {
  app.use(cors(corsOptions));
}


app.use("/user", ApiKey, userRoute)
app.use("/chapter", ApiKey, chaptersRoute)
app.use("/anime", ApiKey, animeRoute)
app.use("/studio", ApiKey, studioRoute)

app.get("/", (req, res) => {
  return res.send('Hello World')
});
app.all('*', (req, res, next) => {
  return res.status(404).json({ "statusCode": 404, 'message': req.originalUrl + ' not fount page' });
});



module.exports = app;
