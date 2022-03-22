function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included 
}

var foo = [];
var N = 10;

for (var i = 1; i <= N; i++) {
   //foo.push(i);
   foo.push(getRandomIntInclusive(2, 12));
}

console.log(foo);
//[
  5, 4,  7, 12, 5,
  3, 8, 10, 10, 7
]

// https://onecompiler.com/javascript/3xww67gbx