var imported = document.createElement('script');
imported.src = 'node_modules/@dagrejs/graphlib/dist/graphlib.min.js';
//document.head.appendChild(imported);
//someshit
Graph = graphlib.Graph;
//creating a graph
var g = new Graph();
//set nodes
g.setNode("x1", "x1");
g.setNode("x2", "x2");
g.setNode("x3", "x3");
g.setNode("x4", "x4");
g.setNode("x5", "x5");
g.setNode("x6", "x6");
//set edges
g.setEdge("x1", "x2","G1");
g.setEdge("x2", "x3","G2");
g.setEdge("x3", "x4","G3");
g.setEdge("x2", "x4","G4");
g.setEdge("x1", "x6","G5");
g.setEdge("x6", "x1","-H2");
g.setEdge("x6", "x5","G6");
g.setEdge("x5", "x1","-H1");
//stack
console.log(g.nodes());
console.log(g.edges());
//var g2 = graphlib.json.read(JSON.parse(str));
console.log(graphlib.json.write(g));
var stack = new Array();
//all forward paths
var paths = new Array();

/**
 * find them
 * @param id the targeted node
 */
function forwardPaths(id) {
    if (stack.includes(id)) {
        return;
    }
    stack.push(id);
    if (g.successors(id).length == 0) {
        var path = stack.slice(0);
        paths.push(path);
    } else {
        for (var i = 0; i < g.successors(id).length; i++) {
            forwardPaths(g.successors(id)[i]);
        }
    }
    stack.pop();
}

var loops = graphlib.alg.findCycles(g);
var loopsNumber = loops.length;
var nonTouchingLoops = new Array(loops.length);

function removeTouched(loops, paths) {
    var newLoops = new Array();

    for (let i = 0; i < paths.length; i++) {
        var flag = true;

        for (let ii = 0; ii < loops.length; ii++) {

            for (let iii = 0; iii = loops[ii].length; iii++) {

                if (paths[i].includes(loops[ii][iii])) {
                    flag = false;
                }
            }

            if (flag) {
                newLoops.push(loops[ii])
            }
        }

    }
    return newLoops;
}

function getDeltas() {
    if (loopsNumber === 1) {
        return;
    }
    for (let i = 2; i <= loopsNumber; i++) {
        if(i===2){
            var l = new Array();
            for (let j = 1; j <= loopsNumber-1; j++) {
                for (let k = j+1; k <= loopsNumber; k++) {
                    if(!intersect(loops[j-1],loops[k-1])){
                        var x = [];
                        x.push(loops[j-1]);
                        x.push(loops[k-1]);
                        l.push(x);
                    }
                }
            }
            nonTouchingLoops.push(l);
        }else if (i===3){

        }
    }
}

function intersect(arr1,arr2) {
    for (let arr1Element of arr1) {
        if(arr2.includes(arr1Element)){
            return true;
        }
    }
    return false;
}

function getLoopGain(loop) {
    //TODO to be adjusted
    var gain = "(";

    for (let i = 0; i < loop.length - 1; i++) {
        gain.concat(g.edge(loop[i], loop[i + 1]));
        gain.concat("*");
    }
    gain.concat(g.edge(loop[loop.length - 1], loop[0]));
    gain.concat(")");
    return gain;
}

function getOtherLoops(){
    var nodes = g.nodes();
    for (let node of nodes) {
        if(g.edge(node,node)){
            loops.push([node,node]);
        }
    }
    for (let i = 0; i < nodes.length-1; i++) {
        for (let j = i+1; j < nodes.length; j++) {
            if(g.edge(nodes[i],nodes[j]) && g.edge(nodes[j],nodes[i])){
                loops.push([nodes[i],nodes[j]]);
            }
        }
    }
    loopsNumber = loops.length;
}
getOtherLoops();
forwardPaths("x1");
getDeltas();