var imported = document.createElement('script');
imported.src = 'node_modules/@dagrejs/graphlib/dist/graphlib.min.js';
//document.head.appendChild(imported);
//someshit
Graph = graphlib.Graph;
//creating a graph
var g = new Graph();
//set nodes
g.setNode("x1",  "x1");
g.setNode("x2", "x2");
g.setNode("x3", "x3");
g.setNode("x4", "x4");
g.setNode("x5", "x5");
g.setNode("x6", "x6");
//set edges
g.setEdge("x1","x2");
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
    if (g.successors(id).length === 0) {
        var path = stack.slice(0);
        paths.push(path);
    }else {
        for (var i = 0; i < g.successors(id).length; i++) {
            forwardPaths(g.successors(id)[i]);
        }
    }
    stack.pop();
}
var loops = graphlib.alg.findCycles(g);
var loopsNumber = loops.length;
var nonTouchingLoops = new Array(loops.length);


function nestedLoops(loops){
    if(loopsNumber === 1){
        return;
    }
    for (let i = 2; i <= loopsNumber; i++) {
        for (let j = 0; j < loops-i+1; j++) {

        }
    }
}

function intersect(array) {
    var object = {};
    var result = [];

    array.forEach(function (item) {
        if(!object[item])
            object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
        if(object[prop] >= 2) {
            result.push(prop);
        }
    }

    return result.length === 0;

}

function getLoopGain(loop){
    //TODO to be adjusted
    var gain = "(";

    for (let i = 0; i < loop.length-1; i++) {
        gain.concat(g.edge(loop[i],loop[i+1]));
        gain.concat("*");
    }
    gain.concat(g.edge(loop[loop.length-1],loop[0]));
    gain.concat(")");
    return gain;
}
forwardPaths("x1");