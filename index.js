var express = require("express");
var app = express();

app.use(express.static('Public'));
app.use(express.static('node_modules'));

var data ={
	nodes: [{id: 1, label: 'someshit'},
    		{id: 2, label: 'c2'},
   			{id: 3, label: 'c3'}],
	edges: [{from:1, to:1, arrows:'to', label: 'top', font: {align: 'top'}},
			{from:2, to:3},
			{from:1, to:3}],
	options: {}
}

app.use("/api",function(req,res){
	res.send(data).end();
})
app.listen(8080,function(){
	console.log("your server started on port 8080");

});