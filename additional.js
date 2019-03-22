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
g.setEdge("x1", "x2", "G1");
g.setEdge("x2", "x3", "G2");
g.setEdge("x3", "x4", "G3");
g.setEdge("x2", "x4", "G4");
g.setEdge("x3", "x6", "G5");
g.setEdge("x1", "x6", "G6");
g.setEdge("x6", "x5", "G7");
g.setEdge("x5", "x4", "G8");
g.setEdge("x2", "x2", "-H1");
g.setEdge("x5", "x3", "-H3");
g.setEdge("x5", "x1", "-H2");

//stack
console.log(g.nodes());
console.log(g.edges());
//var g2 = graphlib.json.read(JSON.parse(str));
console.log(graphlib.json.write(g));
var stack = new Array();
//all forward paths
var paths = new Array();
var loops = [];
var nonTouchingLoops = new Array(loops.length);

/**
 * find them paths and loops
 * @param id the targeted node
 */
function forwardPaths(id) {
    //visited certain node twice
    if (stack.includes(id)) {
        var loop = [];
        loop.push(id);
        //back track till u reach the same node (get the loop)
        for (let i = stack.length - 1; i >= 0; i--) {
            loop.push(stack[i]);
            if (stack[i] === id) {
                break;
            }
        }
        //check if the loop already exists in loops array
        for (let i = 0; i < loops.length; i++) {
            if (loopDoubleganger(loops[i], loop)) {
                return;
            }
        }
        //add the loop
        loops.push(loop);
        //no recursion
        return;
    }
    //visit the node
    stack.push(id);
    //did i reach the sink?
    if (g.successors(id).length == 0) {
        var path = stack.slice(0);
        paths.push(path);
    } else {
        //if not, recursion
        for (var i = 0; i < g.successors(id).length; i++) {
            forwardPaths(g.successors(id)[i]);
        }
    }
    //im done with this node
    stack.pop();
}


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

//======================================================================
function getNonTouching() {
    if (loops.length === 1) {
        return;
    }
    for (let i = 2; i <= loops.length; i++) {
        if (i === 2) {
            var l = new Array();
            for (let j = 1; j <= loops.length - 1; j++) {
                for (let k = j + 1; k <= loops.length; k++) {
                    if (!intersect(loops[j - 1], loops[k - 1])) {
                        var x = [];
                        x.push(loops[j - 1]);
                        x.push(loops[k - 1]);
                        l.push(x);
                    }
                }
            }
            if (l.length > 0)
                nonTouchingLoops.push(l);
        } else if (i === 3) {
            var l = [];
            for (let j = 1; j <= loops.length - 2; j++) {
                for (let k = j + 1; k <= loops.length - 1; k++) {
                    for (let m = k + 1; m <= loops.length; m++) {
                        if (!intersect(loops[j - 1], loops[k - 1])) {
                            if (!intersect(loops[j - 1], loops[m - 1])) {
                                if (!intersect(loops[k - 1], loops[m - 1])) {
                                    var x = [];
                                    x.push(loops[j - 1]);
                                    x.push(loops[k - 1]);
                                    l.push(x);
                                }
                            }
                        }
                    }
                }
            }
            if (l.length > 0)
                nonTouchingLoops.push(l);
        }
    }
}

function intersect(arr1, arr2) {
    for (let arr1Element of arr1) {
        if (arr2.includes(arr1Element)) {
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

function loopDoubleganger(arr1, arr2) {
    if (arr1.length === arr2.length) {
        for (let i = 0; i < arr1.length; i++) {
            if (!arr2.includes(arr1[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function getDelta() {
    var ans = "1 ";
    for (let i = 0; i < loops.length; i++) {
        ans += "-";
        ans += getLoopGain(loops[i]);
    }
    for (let i = 0; i < nonTouchingLoops.length; i++) {
        var c = "+";
        if ((i + 1) % 2 === 0)
            c = "-";
        for (let j = 0; j < nonTouchingLoops[i].length; j++) {
            ans+=c;
            ans+=getLoopGain(nonTouchingLoops[i][j]);
        }
    }
    return ans;
}

//getOtherLoops();
forwardPaths("x1");
getNonTouching();