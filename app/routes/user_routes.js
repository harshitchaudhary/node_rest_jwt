var ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
var secret = 'stupid_chat';

module.exports = function(app, db) {
	app.get('/user', (req, res) => {
		token = req.headers['x-access-token'];
		if(token == null || token == "") {
			res.status(401).send({'error':'An error has been occured', 'message':'Auth token is missing'}) 
		}
		else {
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.status(500).send({'error':'failed to authenticate'});
				}
				else {
					db.collection('user').find({}, (err, result) => {
						if(err) {
							res.send({'error': 'An error has occured'});
						}
						else {
							users = new Array();
							result.toArray(function(err, docs) {
								if(err) {
									res.send({'error': 'An error has occured'});
								}
								else {
									res.send(docs);
								}
							});
						}
					});
				}
			});
		}
	});
	app.get('/user/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id)};
		
		db.collection('user').findOne(details, (err, item) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			}
			else {
				res.send(item);
			}
		});
	});
	app.post('/user', (req, res) => {
		const user = {username: req.body.username, email: req.body.email, password: req.body.password};
		db.collection('user').insert(user, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occured'});
			}
			else {
				res.send(result.ops[0])
			}
		});
		//res.send('Hello');
	});
	
	app.post('/login', (req, res) => {
		user = {username: req.body.username, password: req.body.password};
		if(user.username == null || user.username == "" || user.password == null || user.password == "") {
			res.send({'error':'An error has occured', 'message': 'username or password can\'t be empty'});
		}
		else {
			db.collection('user').findOne(user, (err, result) => {
				if(err) {
					res.send({'error':'An error has occured'});
				}
				else {
					if(result == null || result == "") {
						res.send({'error':'An error has occured', 'message':'Username or Password is incorrect'});	
					}
					else {
						var token = jwt.sign({id: result._id}, secret, {expiresIn: 86400})
						res.send({'success':'User Found', 'token': token, 'data':result});
					}
				}
			});
	       }
	});
};
