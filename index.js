const path = require('path');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const mainRoutes = require('./routes/main');
const scrapRoutes = require('./routes/scrap');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainRoutes);
app.use(scrapRoutes);

app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`)
})
