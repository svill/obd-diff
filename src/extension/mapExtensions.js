Map.prototype.reduce = function (f, initial) {
  var result = initial !== undefined ? initial : ''
  for (var v of this) result = f(result, v)
  return result
};
