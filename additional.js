var imported = document.createElement('script');
imported.src = 'node_modules/@dagrejs/graphlib/dist/graphlib.min.js';
document.head.appendChild(imported);
//someshit
Graph = graphlib.Graph;
//creating a graph
var g = new Graph();
//set nodes
g.setNode("x1", "x1");
g.setNode("x2", "x2");
g.setNode("x3", "x3");
g.setNode("x4", "x4");
//set edges
g.setEdge("x1", "x2");
g.setEdge("x2", "x3");
g.setEdge("x3", "x4");
g.setEdge("x2", "x4");
//stack
console.log(g.nodes());
console.log(g.edges());
var stack = new Array();
//all forward paths
var paths = new Array();
/**
 * find them
 * @param id the targeted node
 */
function forwardPaths(id) {
    stack.push(id);
    if (g.successors(id).length == 0) {
        var path = stack.copyWithin(stack.length, 0);
        paths.push(path);
    }else {
        for (var i = 0; i < g.successors(id).length; i++) {
            forwardPaths(g.successors(id)[i]);
        }
    }
    stack.pop();
}
forwardPaths("x1");