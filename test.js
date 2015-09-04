var sql = require('./')
var fs = require('fs')
var test = require('tape')

test('check sql', function (t) {
  var schema = fs.readFileSync('schema.sql').toString()
  var proto = fs.readFileSync('schema.proto').toString()
  t.same(sql(schema), proto)
  t.end()
})