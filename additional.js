var imported = document.createElement('script');
imported.src = 'node_modules/@dagrejs/graphlib/dist/graphlib.min.js';
//document.head.appendChild(imported);
//someshit
Graph = graphlib.Graph;
//creating a graph
var g = new Graph();
//set nodes
g.setNode("f3d2bd1a-b2b0-4052-b0c0-5122479ba7bb",  -187.20000457763672, -140, "2");
g.setNode("2", "x2");
g.setNode("x3", "x3");
g.setNode("x4", "x4");
g.setNode("x5", "x5");
g.setNode("x6", "x6");
//set edges
g.setEdge("867a70e8-4e73-49fe-9cd7-ca031d594e14","f3d2bd1a-b2b0-4052-b0c0-5122479ba7bb", "3");
g.setEdge("x2", "x3");
g.setEdge("x3", "x4");
g.setEdge("x2", "x4");
g.setEdge("x1", "x6");
g.setEdge("x6", "x5");
g.setEdge("x5", "x1");
//stack
console.log(g.nodes());
console.log(g.edges());
//var g2 = graphlib.json.read(JSON.parse(str));
console.log( graphlib.json.write(g));
var stack = new Array();
//all forward paths
var paths = new Array();
/**
 * find them
 * @param id the targeted node
 */
function forwardPaths(id) {
    if(stack.includes(id)){
        return;
    }
    stack.push(id);
    if (g.successors(id).length == 0) {
        var path = stack.slice(0);
        paths.push(path);
    }else {
        for (var i = 0; i < g.successors(id).length; i++) {
            forwardPaths(g.successors(id)[i]);
        }
    }
    stack.pop();
}
forwardPaths("x1");