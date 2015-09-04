var protobuf = require('protocol-buffers-schema')
var mappings = {
  'bigint': 'int64',
  'integer': 'int32',
  'text': 'string',
  'real': 'float',
  'date': 'string',
  'boolean': 'bool'
}

// from https://github.com/michalbe/sql-create-table-to-json/blob/master/index.js
var removeComments = function (data) {
  data = data.replace(/\/\*(.*)/g, '').replace(/([ \t]*\n){3,}/g, '\n\n');
  return data;
}

module.exports = function (data) {
  var data = removeComments(data)
  var schemas = data.split('\n\n')

  var result = {
    syntax: 2,
    package: null,
    enums: [],
    messages: []
  }
  schemas.forEach(function (schema) {
    var match = schema.match(/.*CREATE\s+TABLE\s+(\S+).*/);
    if (match) {
      var tableName = match[1].replace(/[\'\`\"]+/ig, '');
      var fields = schema.substring(schema.indexOf('(')).trim()
      fields = fields.replace(/^\(/g, '').replace(/\);?$/g, '')
      result.messages.push(Message(tableName, fields))
    }
  })
  return protobuf.stringify(result)
}

function Message (name, fields) {
  var message = {
    name: name,
    enums: [],
    messages: [],
    fields: []
  }
  var lines = fields.split(',');
  var tag = -1
  message.fields = lines.map(function (line) {
    tag += 1
    return Field(line, tag)
  })
  return message
}

function Field (field, tag) {
  field = field.trim()
  var parts = field.split(/\s+/)
  var type = mappings[parts[1].trim()]
  return {
    name: field,
    type: type,
    tag: tag,
    repeated: false,
    required: false
  }
}