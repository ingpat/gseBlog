var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var config = require('../config/config');

var db = require('monk')(config.database);

// Homepage Blog Posts
router.get('/addCategory', function (req, res, next) {	
		res.render('addcategory', {
			"title": 'Add Category'
		});
	});

router.post('/addCategory', function (req, res, next) {
	var title = req.body.title;
	

	req.checkBody('title', 'title field is required').notEmpty();
	
	//check errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('addcategory', {
			'errors': errors,
			'title': title
		});
	} else {
		var categories = db.get('categories');
		categories.insert({
			'title': title
		}, function (err, category) {
			if (err) res.send('there an error in submitting');

			req.flash('success', 'Category submitted');
			res.location('/');
			res.redirect('/addCategory');
		});
	}
})

module.exports = router;
