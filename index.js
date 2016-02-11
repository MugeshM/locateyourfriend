var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose');
app.use('/public', express.static(__dirname + '/public'));

server.listen(3000);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


mongoose.connect('mongodb://localhost/location', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
});

var locationSchema = mongoose.Schema({
	name: String,
	mylat: String,
        mylon: String,
	trackedon: {type: Date, default: Date.now}
});

var Location = mongoose.model('Location', locationSchema);

io.sockets.on('connection', function(socket){
	socket.on('mylocation', function(data){
console.log(data);
//mongodb code to insert location details
/*
var newMsg = new Location({name:'mugesh',mylat: data.mylat, mylon: data.mylon});
			newMsg.save(function(err){
			if(err) throw err;});
var query = ;
*/
var query = Location.update({ name: data.name }, {mylat: data.mylat, mylon: data.mylon}, { upsert : true });
query.exec();

});

socket.on('getfriendloc', function(data, callback){
		console.log("fetching "+data+"'s location");
		if(data == ''){
			callback('Error!  Enter your friend name.');
		} else{
	var query = Location.find({"name":data});
	query.exec(function(err, docs){
		if(err) throw err;
   console.log(docs);
		socket.emit('friendloc', docs);
	});

	}
	});

});
