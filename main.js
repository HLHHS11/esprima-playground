var esprima = require('esprima');
var fs = require('fs');

function walk(parent, edge, node, proc) {
  if (node === null || "object" != typeof node) {
    return;
  }
  proc(parent, edge, node);
  for (var key in node) {
    walk(node, key, node[key], proc);
  }
}

function quoted(node) {
  var s = "";
  if ("type" in node) {
    s += node.type;
  }
  if ("name" in node) {
    s += "(" + node.name + ")";
  }
  if ("value" in node) {
    s += "[" + node.value + "]";
  }
  if ("operator" in node) {
    s += "(" + node.operator + ")";
  }
  if (Array.isArray(node)){
    s = "Array";
  }
  var j = JSON.stringify([s]);
  return j.substr(1, j.length - 2);
}

function codeToDot(src) {
  var ast = esprima.parse(src);
  var str = "";
  var id = 0;
  walk(null, null, ast, function (parent, edge, node) {
    node["dot_id"] = "n" + (id++);
    if ( parent!==null ){
      str += parent.dot_id + "->" + node.dot_id + "[taillabel=\"" + edge + "\"]\n";
    }
    var label = quoted(node);
    str += node.dot_id + "[ label=" + label + "]\n";
  });
  return str;
}
fs.readFile(process.argv[2], 'utf8', function (err, text) {
  dot = codeToDot(text);
  process.stdout.write("digraph{graph [dpi=288;]; node[ shape=box ];\n");
  process.stdout.write(dot);
  process.stdout.write("}\n");
});

