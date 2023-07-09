
function hoge(foo, bar) {
    for (var ix in bar) {
      var val = bar[ix];
      if (val < ix) {
        console.log(val + (-10 + 100));
      }
    }
  }
  
  hoge("45", ["34", "56"]);
  