let express = require('express');
let router = express.Router();
let {TeamList} = require('../../project-model');
let bp = require('body-parser');
let jsonParser = bp.json();


router.get( "/", ( req, res, next ) => {              //GET ALL TEAMS
    TeamList.get()
        .then( teams => {
            return res.status( 200 ).json( teams );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

router.get( "/:Id", ( req, res, next ) => {                   //GET ONE TEAM
    let team = req.params.Id;
    TeamList.getTeam(team)
        .then( team => {
            return res.status( 200 ).json( team );
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
});

router.post("/", jsonParser, (req, res, next) => {            //CREATE TEAM    
    let newTeam = req.body;

    console.log(newTeam);
    if (!newTeam.teamName || !newTeam.desc || !newTeam.creator) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TeamList.post(newTeam)
        .then(newTeam => {
            return res.status(201).json(newTeam);
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).json({
                message: err,
                status: 500
            })
        });
});

router.post("/Add", jsonParser, (req, res, next) => {     //ADD MEMBER TO TEAM    
    let teamName = req.body.teamName;
    let member = req.body.user;   

    if (!teamName || !member) {
        res.statusMessage = "Missing field in the body";
        return res.status(406).json( {
            message: "Missing field in the body",
            status: 406
        });
    }
    TeamList.addMember(teamName, member)
        .then(updTeam => {
            return res.status(201).json(updTeam);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB";
            return res.status(500).json({
                message: "Something went wrong with the DB",
                status: 500
            })
        });
});

module.exports = router;