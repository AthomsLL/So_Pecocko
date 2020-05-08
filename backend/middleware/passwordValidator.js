const passwordValidator = require('password-validator');

// Création du schéma
let passwordSchema = new passwordValidator();

// Ajout des propriétés au schéma
passwordSchema
.is().min(8) // Minimum 8 caractères
.is().max(100) // Maximum 100 caractères
.has().uppercase() // Doit contenir au moins 1 majuscule
.has().lowercase() // Doit contenir au moins 1 minuscule
.has().digits() // Doit contenir au moins 1 chiffre
.has().not().spaces() // Ne doit pas contenir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Passw0rd123']) // Liste noire de mot de passe

module.exports = passwordSchema;