const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://Athoms:vGVLH6VlssrBNwaK@sopecockobackend-hmk61.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration des headers CORS pour autoriser l'accès multi-origines
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Gestionnaire servant à lire le contenu de la requête
app.use(bodyParser.json());

// Gestionnaire de routage pour les images
app.use('/uploads/images', express.static(path.join(__dirname, '/uploads/images')));

// Utilisation des routes pour les sauces
app.use('/api/sauces', sauceRoutes);

// Utilisation des routes pour les users
app.use('/api/auth', userRoutes);

module.exports = app;