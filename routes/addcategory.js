var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var config = require('../config/config');

var db = require('monk')(config.database);

// Homepage Blog Posts
router.get('/addCategory', function (req, res, next) {
	var categories = db.get('categories');
	categories.find({}, {}, function (err, categories) {
		res.render('addpost', {
			"title": 'add Post'
			, 'categories': categories
		});
	});
});

router.post('/addCategory', function (req, res, next) {
	var title = req.body.title;
	

	req.checkBody('title', 'title field is required').notEmpty();
	
	//check errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('addCategory', {
			'errors': errors,
			'title': title
		});
	} else {
		var categories = db.get('categories');
		posts.insert({
			'title': title
		}, function (err, post) {
			if (err) res.send('there an error in submitting');

			req.flash('success', 'Category submitted');
			res.location('/');
			res.redirect('/');
		});
	}
})

module.exports = router;
