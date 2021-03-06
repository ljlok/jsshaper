"use strict"; "use restrict";

var require = require || function(f) { load(f); };
var Watch = Watch || require("../watch.js") || Watch;
var Log = Log || require("../../../log.js") || Log;

// watch o for invalid age [1]
var o = {name: "marvin", age: 100000};
Watch(o, "age", function() {
    if (o.age < 0) {
        Log.verb("plugins/watcher/tests/example.js", 11, "<anonymous>", "invalid age ({0})", o.age);
    }
});

// watch arr for non-string assignments [2]
var arr = ["asdf", "zxcv"];
Watch(arr, null, function(arr, name, op) {
    var v = arr[name];
    if (typeof v !== "string") {
        Log.verb("plugins/watcher/tests/example.js", 20, "<anonymous>", "arr[{0}] assigned with {1} of type {2}", name, v, typeof v);
    }
});

// watch Array.prototype for patches [3]
Watch(Array.prototype, null, function(obj, name, op) {
    Log.verb("plugins/watcher/tests/example.js", 26, "<anonymous>", "patched Array.prototype.{0}", name);
});

// modify push so that pushes are watched, too. triggers [3]
Watch.set("=", Array.prototype, "push", function(v) {
    return Watch.set("=", this, String(this.length), v);
});

Watch.set("+=", o, "age", 1);
Watch.set("/=", o, "age", -1); // triggers [1]
Watch.set("=", arr, String(2), "ok");
arr.push(0); // triggers [2]
