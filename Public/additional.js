var imported = document.createElement('script');
imported.src = 'Public/graphlib.min.js';
//document.head.appendChild(imported);
//someshit
Graph = graphlib.Graph;
//creating a graph
// //set nodes
// g.setNode("x1", "x1");
// g.setNode("x2", "x2");
// g.setNode("x3", "x3");
// g.setNode("x4", "x4");
// g.setNode("x5", "x5");
// g.setNode("x6", "x6");
// //set edges
// g.setEdge("x1", "x2", "G1");
// g.setEdge("x2", "x3", "G2");
// g.setEdge("x3", "x4", "G3");
// g.setEdge("x2", "x4", "G4");
// g.setEdge("x3", "x6", "G5");
// g.setEdge("x1", "x6", "G6");
// g.setEdge("x6", "x5", "G7");
// g.setEdge("x5", "x4", "G8");
// g.setEdge("x2", "x2", "-H1");
// g.setEdge("x5", "x3", "-H3");
// g.setEdge("x5", "x1", "-H2");
//
// //stack
// console.log(g.nodes());
// console.log(g.edges());
//var g2 = graphlib.json.read(JSON.parse(str));
// console.log(graphlib.json.write(g));

var stack = [];
//all forward paths
var paths = [];
var loops = [];

/**
 * find them paths and loops
 * @param id the targeted node
 */

function b4forwardpaths() {
    console.log(stack = []);
    console.log(g);
    console.log(paths = []);
    console.log(loops = []);
}

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
    console.log(g.node(id));
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
    return paths;
}

// console.log(forwardPaths("x1"));
// console.log(paths);
// console.log(loops);

/**
 *
 * @returns array of loops the same size as the paths {any[]}
 */
function removeTouched() {
    //3d array
    var UntouchedLoops = [];
    //2d array
    var loop = [];
    for (let i = 0; i < paths.length; i++) {
        var flag = true;
        for (let ii = 0; ii < loops.length; ii++) {
            for (let iii = 0; iii < loops[ii].length; iii++) {
                //checks if it contains a loop touching a path
                if (paths[i].includes(loops[ii][iii])) {
                    flag = false;
                    break;
                }
            }
            //pushing the loop
            if (flag) {
                loop.push(loops[ii]);
                console.log(loop);
            }
            flag = true;
        }
        UntouchedLoops.push(loop.slice(0));
        loop = [];
    }
    return UntouchedLoops;
}

//======================================================================

function fillBoolean(touch) {
    nonTouchingLoops[0] = [];
    for (let i = 0; i < loops.length - 1; i++) {
        for (let j = i + 1; j < loops.length; j++) {
            if (!intersect(loops[i], loops[j])) {
                touch[i][j] = false;
                nonTouchingLoops[0].push([i, j]);
            }
        }
    }
}

var nonTouchingLoops = [];

function getNonTouching() {
    //if we have only 1 loop we dont need to do anytihng
    if (loops.length === 1) {
        return;
    }
    //boolean array of touched loops
    var touch = [];
    //fill it with false
    for (let i = 0; i < loops.length; i++) {
        var touch1 = [];
        for (let i = 0; i < loops.length; i++) {
            touch1.push(true);
        }
        touch.push(touch1);
    }
    //get each 2 touched loops
    fillBoolean(touch);
    //for more than 2
    for (let i = 1; i < loops.length; i++) {
        nonTouchingLoops[i] = [];
        for (let j = 0; j < nonTouchingLoops[i - 1].length; j++) {
            for (let l = 0; l < loops.length; l++) {
                var flag = false;
                var temp = [];
                for (let k = 0; k < nonTouchingLoops[i - 1][j].length; k++) {
                    temp.push(nonTouchingLoops[i - 1][j][k]);
                    if (!nonTouchingLoops[i - 1][j].includes(l)) {
                        flag |= touch[nonTouchingLoops[i - 1][j][k]][l];
                    } else {
                        flag = true;
                    }
                }
                if (!flag) {
                    temp.push(l);
                    nonTouchingLoops[j].push(temp);
                }
            }
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
    if (loop.length == 2) {
        gain += g.edge(loop[0], loop[1]);
        gain += ")";
        return gain;
    }
    for (let i = 1; i < loop.length; i++) {
        gain += g.edge(loop[i], loop[i - 1]);
        if (i < loop.length - 1)
            gain += "*";
    }
    // gain+=g.edge(loop[loop.length - 1], loop[0]);
    gain += ")";
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
    getNonTouching();
    var ans = "1 ";
    ans += "-(";
    for (let i = 0; i < loops.length; i++) {
        ans += getLoopGain(loops[i]);
        if (i < loops.length - 1)
            ans += "+";
    }
    ans += ")";
    var c = "+";
    for (let i = 0; i < nonTouchingLoops.length; i++) {
        if (nonTouchingLoops[i].length > 0) {
            c = ((i + 1) % 2 === 0) ? "-" : "+";
            ans += c;
            ans += "(";
        }
        for (let j = 0; j < nonTouchingLoops[i].length; j++) {
            console.log(nonTouchingLoops[i][j]);
            for(let k = 0;k<nonTouchingLoops[i][j].length;k++){
                ans += getLoopGain(loops[nonTouchingLoops[i][j][k]]);
                if(k<nonTouchingLoops[i][j].length-1){
                    ans+="*";
                }
            }
            if (j + 1 < nonTouchingLoops[i].length)
                ans += "+";
        }
        ans += ")";
    }
    return ans;
}

function getDeltas() {
    var ans = [];
    var ntl = removeTouched();
    var d = "1";
    if (ntl.length > 0)
        d += "-(";
    for (let i = 0; i < ntl.length; i++) {
        for (let j = 0; j < ntl[i]; j++) {
            d += getLoopGain(ntl[i]);
            if (i + 1 < ntl.length + 1)
                d += "+";
        }
        ans.push(d + ")");
    }
    return ans;
}

function getTF(firstNode) {
    b4forwardpaths();
    forwardPaths(firstNode.id);
    var numerator = "";
    var denumerator = getDelta();
    var deez = getDeltas();
    for (let i = 0; i < paths.length; i++) {
        numerator += "(";
        for (let j = 0; j < paths[i].length - 1; j++) {
            numerator += g.edge(paths[i][j], paths[i][j + 1]);
            if (j < paths[i].length - 2)
                numerator += "*";
        }
        numerator += ")*(" + deez[i] + ")";
    }
    return numerator + " //// " + denumerator;
}

//getOtherLoops();
// forwardPaths("x1");
// getNonTouching();
// for (let i = 0; i < loops.length; i++) {
//     getLoopGain(loops[i]);
// }
// getNonTouching();