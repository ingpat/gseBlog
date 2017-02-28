var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var config = require('../config/config');

var db = require('monk')(config.database);

// Homepage Blog Posts
router.get('/addPost', function (req, res, next) {
	var categories = db.get('categories');
	categories.find({}, {}, function (err, categories) {
		res.render('addpost', {
			"title": 'add Post'
			, 'categories': categories
		});
	});
});

router.post('/addPost', function (req, res, next) {
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	req.checkBody('title', 'title field is required').notEmpty();
	req.checkBody('body', 'body field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('addPost', {
			'errors': errors,
			'title': title,
			'body': body
		});
	} else {
		var posts = db.get('posts');
		posts.insert({
			'title': title,
			'category': category,
			'body': body,
			'author': author,
			'date': date
		}, function (err, post) {
			if (err) res.send('there an error in submitting');

			req.flash('success', 'Post submitted');
			res.location('/');
			res.redirect('/');
		});
	}
})

module.exports = router;
