var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var config = require('../config/config');

var db = require('monk')(config.database);

router.get('/showCategory', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category: req.params.category},{}, function(err, posts){
		res.render('index',{
			"title":req.params.category,
			"posts": posts
		});
	});
});

router.get('/addCategory', function(req, res, next) {
	res.render('addcategory',{
		"title":"Add Category"
	});
});

router.post('/addCategory', function(req, res, next){
	//get form values
	var title = req.body.title;

	//Form Validation
	req.checkBody('title','Title field is required').notEmpty();

	//Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategory',{
			"errors": errors,
			"title": title,
		});
	} else {
		var categories = db.get('categories');

		//Submit to db
		categories.insert({
			"title" : title,
		}, function(err, category){
			if(err){
				res.send('There was an issue submitting the category');
			} else {
				req.flash('success','Category Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
