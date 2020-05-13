const mongoose = require('mongoose');
const validate = require('../middleware/inputValidator');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true, default: null },
    name: { type: String, required: true, default: null, validate: validate.nameValidator },
    manufacturer: { type: String, required: true, default: null, validate: validate.manufacturerValidator },
    description: { type: String, required: true, default: null, validate: validate.descriptionValidator },
    mainPepper: { type: String, required: true, default: null, validate: validate.mainPepperValidator },
    imageUrl: { type: String, required: true, default: null },
    heat: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false, default: [] },
    usersDisliked: { type: [String], required: false, default: [] }
});

module.exports = mongoose.model('Sauce', sauceSchema);