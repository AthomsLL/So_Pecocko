const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    let isValid = true;
    let message = '';
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const regexEmail = /^.+\@\S+\.\S+$/;

    if (!regexEmail.test(req.body.email)) {
        isValid = false;
        message = "Veuillez renseigner une adresse email correcte.";
    } 
    if (!regexPassword.test(req.body.password)) {
        isValid = false;
        message = "Le mot de passe doit comporter au moins 8 caractères, dont au moins 1 minuscule, 1 majuscule et 1 chiffre.";
    } 
    if (!regexEmail.test(req.body.email) && !regexPassword.test(req.body.password)) {
        isValid = false;
        message = "Veuillez renseigner des identifiants de connexion corrects."
    }

    if (!isValid) {
        res.status(403).json({ message: message });
    } else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Identifiants incorrects !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Identifiants incorrects !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            '$2y$10$Xk.vZ42QBs0MMhnniqtMfu4cgZr7jFuV6J5Orlj1SBvb/xSqKal4y',
                            { expiresIn: '1h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};