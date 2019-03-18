var express = require("express");
var app = express();

var _ = require("underscore");

var uuid = require("uuid-v4");
app.use(express.static('Public'));
app.use(express.static('node_modules'));
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



var data ={
	nodes: [],
	edges: [],
	options: {
		edges: {
      arrows:'to'
        }
    }
}
	

app.post("/api/node",function(req,res){
	var newNode = req.body;
	var foundNode = _.find(data.nodes,function(node){
		return node.id === newNode.id;
	});

	if (foundNode) {return;}

	data.nodes.push(newNode);
	res.send(newNode).end();
});

app.post("/api/edge",function(req,res){
	var newEdge = req.body;
	newEdge.id = uuid();
	data.edges.push(newEdge);

	res.send(newEdge).end();
});

app.put("/api/node",function(req,res){
	var updatedNode =req.body;

	var realizedNode;
	_.each(data.nodes,function(node){
		if (node.id === updatedNode.id) {
			node.label=updatedNode.label;
			realizedNode =node;
		}
	});
	res.send(realizedNode).end();
});

app.put("/api/edge",function(req,res){
	var updatedEdge =req.body;

	var realizedEdge;
	_.each(data.edges,function(edge){
		if (edge.id === updatedEdge.id) {
			edge.from=updatedEdge.from;
			edge.to=updatedEdge.to;
			realizedEdge =edge;
		}
	});
	res.send(realizedEdge).end();
});

app.delete("/api/node", function(req, res){
	var deleteNode =req.body.node;
	var deleteResult ={
		nodes: [],
		edges: []
	};
		

	var updateNodes =_.filter(data.nodes,function(node){
		var keep = (node.id !== deleteNode);
		if(!keep){
			deleteResult.nodes.push(node);
		}
		return keep;
	});

	var updateEdges =_.filter(data.edges,function(edge){
		var keep = (edge.from !== deleteNode) || (edge.to !== deleteNode);
		if(!keep){
			deleteResult.edges.push(edge);
		}
		return keep;
	});

	data.nodes =updateNodes;
	data.edges =updateEdges;

	res.send(deleteResult).end();
});

app.delete("/api/edge", function(req, res){
	var deleteEdge =req.body.edge;
	var deleteResult ={
		nodes: [],
		edges: []
	};
		

	var updateEdges =_.filter(data.edges,function(edge){
		var keep = (edge.id !== deleteEdge);
		if(!keep){
			deleteResult.edges.push(edge);
		}
		return keep;
	});

	data.edges =updateEdges;

	res.send(deleteResult).end();
});

app.use("/api",function(req,res){
	res.send(data).end();
});
app.listen(8080,function(){
	console.log("your server started on port 8080");

});
