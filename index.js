var protobuf = require('protocol-buffers-schema')
var mappings = {
  'bigint': 'int64',
  'integer': 'int32',
  'text': 'string',
  'float': 'float',
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
    var match = schema.match(/.*CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS)?\s+(\S+).*/i);
    if (match) {
      if (schema.match(/.*IF\s+NOT\s+EXISTS.*/i)) var loc = 2
      else var loc = 1
      var tableName = normalize(match[loc])
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
  var tag = 0
  message.fields = lines.map(function (line) {
    tag += 1
    return Field(line, tag)
  })
  return message
}

function Field (field, tag) {
  field = field.trim()
  var parts = field.split(/\s+/)
  var type = mappings[parts[1].trim()] || 'string'
  var required = field.match(/.*NOT\s+NULL.*/)
  return {
    name: normalize(parts[0]),
    type: type,
    tag: tag,
    repeated: false,
    required: required && true || false
  }
}

function normalize (string) {
  return string.replace(/[\'\`\"]/ig, '')
}