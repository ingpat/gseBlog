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

	if(req.files.mainimage){
		var mainImageOriginalName = req.files.mainimage.originalname;
		var mainImageName = req.files.mainimage.name;
		var mainImageMime = req.files.mainimage.mimetype;
		var mainImagePath = req.files.mainimage.path;
		var mainImageExt = req.files.mainimage.extension;
		var mainImageSize = req.files.mainimage.size;
	} else {
		var mainImageName = 'noimage.png';
	}


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
			'date': date,
			"mainimage": mainImageName

		}, function (err, post) {
			if (err) res.send('there an error in submitting');

			req.flash('success', 'Post submitted');
			res.location('/');
			res.redirect('/');
		});
	}
})

router.post('/addComment', function(req, res, next){
	//get form values
	var name = req.body.name; 
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var commentdate = new Date();

	//Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email is not formatted correctly').isEmail();
	req.checkBody('body','Body field is required').notEmpty();

	//Check Errors
	var errors = req.validationErrors();

	if(errors){
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('showpost',{
				"errors": errors,
				"post":post
			});
		});

	} else {
		var comment = {"name": name, "email": email, "body": body, "commentdate": commentdate}

		var posts = db.get('posts');

		posts.update({
				"_id": postid
			},
			{
				$push:{
					"comments":comment
				}
			},
			function(err,doc){
				if(err){
					throw err;
				} else {
					req.flash('success','Comment Added');
					res.location('showPost/'+postid);
					res.redirect('/showPost/'+postid);
				}
			}
		);
	}
});


router.get('/showPost/:id', function(req, res, next){
	var posts = db.get('posts');
	posts.findById(req.params.id, function(err, post){
		res.render('showpost', {
		"post": post
		});
	});
});


module.exports = router;
