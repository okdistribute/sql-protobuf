var protobuf = require('protocol-buffers-schema')
var sql = require('./')
var fs = require('fs')
var test = require('tape')
var path = require('path')

function testSchema (filename) {
  test('check ' + filename, function (t) {
    var schema = fs.readFileSync(filename).toString()
    var expected = fs.readFileSync('tests/schema.proto').toString()
    t.deepEqual(protobuf(sql(schema)), protobuf(expected))
    t.end()
  })
}

fs.readdir('tests', function (err, files) {
  files.forEach(function (filename) {
    if (filename.indexOf('.sql') > -1) {
      testSchema(path.join('tests', filename))
    }
  })
})
