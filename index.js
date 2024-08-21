const express = require('express');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
const session = require('express-session');
const { PORT } = require('./src/config');
const { SESSION_SECRET } = require('./src/config/app');

const app = express();
const port = PORT;

// Configure session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user information
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Configure the OpenID Connect Strategy
passport.use('oidc', new OpenIDConnectStrategy({
    issuer: 'https://issuer.example.com', // Replace with your OIDC provider's issuer URL
    authorizationURL: 'https://issuer.example.com/authorize',
    tokenURL: 'https://issuer.example.com/token',
    userInfoURL: 'https://issuer.example.com/userinfo',
    clientID: 'your-client-id', // Replace with your client ID
    clientSecret: 'your-client-secret', // Replace with your client secret
    callbackURL: 'http://localhost:3000/callback', // Replace with your callback URL
    scope: 'openid profile email'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
    // Here you can handle the user profile information and tokens
    return done(null, profile);
}));

// Define routes
app.get('/', (req, res) => {
    res.send('<a href="/login">Login with OpenID Connect</a>');
});

app.get('/login', passport.authenticate('oidc'));

app.get('/callback', passport.authenticate('oidc', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.json(req.user);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
