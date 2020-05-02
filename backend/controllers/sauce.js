const Sauce = require('../models/Sauce');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`
    } : { ...req.body };

    if (req.file) {
        Sauce.findOne({ _id: req.params.id }, 'imageUrl')
        .then(sauce => {
            const filename = sauce.imageUrl.split('uploads/images/')[1];
            fs.unlink(`uploads/images/${filename}`, () => {
                console.log('Ancienne image effacée avec succès !');
            })
        })
        .catch(error => console.log( error ));
    }

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Sauce mise à jour avec succès !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('uploads/images/')[1];
        fs.unlink(`uploads/images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

// Fonction gérant la mise à jour des likes/dislikes
updateSauceLikes = (actionUser, numberLikes, method, arrayUsers, userId, id) => {
    let objectLikes = {
        $inc: { [actionUser]: numberLikes },
        [method]: { [arrayUsers]: userId },
        _id: id
    }

    return objectLikes;
}

exports.likeSauce = (req, res, next) => {
    switch (req.body.like){
        //likes = 1
        //uptade the sauce, send message/error
        case 1:
            Sauce.updateOne({_id: req.params.id}, updateSauceLikes("likes", 1, "$push", "usersLiked", req.body.userId, req.params.id))
                .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
                .catch((error) => {res.status(400).json({error: error});});
            break;
        //likes = -1
        //uptade the sauce, send message/error
        case -1:
            Sauce.updateOne({_id: req.params.id}, updateSauceLikes("dislikes", 1, "$push", "usersDisliked", req.body.userId, req.params.id))
                .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
                .catch((error) => {res.status(400).json({error: error});});
            break;
        //cancel = 0
        //check if the user had liked or disliked the sauce
        //uptade the sauce, send message/error
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if(sauce.usersLiked.find(user => user === req.body.userId)){
                        Sauce.updateOne({_id: req.params.id}, updateSauceLikes("likes", -1, "$pull", "usersLiked", req.body.userId, req.params.id))
                            .then(() => res.status(201).json({ message: 'Like annulé avec succès !' }))
                            .catch((error) => {res.status(400).json({error: error});});
                        
                    }
                    if(sauce.usersDisliked.find(user => user === req.body.userId)){
                        Sauce.updateOne({_id: req.params.id}, updateSauceLikes("dislikes", -1, "$pull", "usersDisliked", req.body.userId, req.params.id))
                            .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' }))
                            .catch((error) => {res.status(400).json({error: error});});
                    }
                })
                .catch((error) => {res.status(404).json({error: error});});    
            break;
        default:
            console.error("Impossible d'ajouter Like/Dislike à cette sauce");
    }
};

/*exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case 1 && !sauce.usersLiked.find(user => user === req.body.userId):
                    Sauce.updateOne({ _id: req.params.id }, updateSauceLikes("likes", 1, "$push", "usersLiked", req.body.userId, req.params.id))
                        .then(() => res.status(200).json({ message: 'Like ajouté avec succès !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                case -1 && !sauce.usersDisliked.find(user => user === req.body.userId):
                    Sauce.updateOne({ _id: req.params.id }, updateSauceLikes("dislikes", 1, "$push", "usersDisliked", req.body.userId, req.params.id))
                        .then(() => res.status(200).json({ message: 'Dislike ajouté avec succès !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                case 0 && sauce.usersLiked.find(user => user === req.body.userId):
                    Sauce.updateOne({ _id: req.params.id }, updateSauceLikes("likes", -1, "$pull", "usersLiked", req.body.userId, req.params.id))
                        .then(() => res.status(200).json({ message: 'Like annulé avec succès !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                case 0 && sauce.usersDisliked.find(user => user === req.body.userId):
                    Sauce.updateOne({ _id: req.params.id }, updateSauceLikes("dislikes", -1, "$pull", "usersDisliked", req.body.userId, req.params.id))
                        .then(() => res.status(200).json({ message: 'Dislike annulé avec succès !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    console.log("Impossible d'ajouter Like/Dislike à cette sauce");
            }
        })
        .catch(error => res.status(500).json({ error }));
};*/

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }));
};