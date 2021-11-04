const path = require('path');

const express = require('express');
// const session = require('express-session');
// const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const mainRoutes = require('./routes/main');
// const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(flash());

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   req.user = req.session.user;
// });

// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     next();
// });

app.use(mainRoutes);
// app.use(authRoutes);

app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`)
})
