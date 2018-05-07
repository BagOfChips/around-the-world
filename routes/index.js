var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
    res.render('index', {
        TITLE: 'Around the World - Demo by Letao',
        MAPS_API_KEY: process.env.MAPS_API_KEY
    });
});

module.exports = router;
