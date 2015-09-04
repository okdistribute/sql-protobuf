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
    var match = schema.match(/.*CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS)?[\s+]?([\S|\`]+).*/i);
    if (match) {
      var tableName = normalize(match[2])
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

  var lines = fields.split(/,[$|\"|\`|\'|\s+]/i);
  var tag = 0
  message.fields = lines.map(function (line) {
    tag += 1
    return Field(line, tag)
  })
  return message
}

function Field (data, tag) {
  var field = {
    name: null,
    type: null,
    tag: tag,
    options: {},
    repeated: false,
    required: false
  }

  var tokens = data.trim().split(/\s+/)
  field.name = normalize(tokens[0])
  field.type = mappings[tokens[1].trim()] || 'string'
  if (data.match(/.*NOT\s+NULL.*/i)) {
    field.required = true
  }
  var default_match = data.match(/.*DEFAULT\s+(\S+).*/i)
  if (default_match) {
    field.options.default = default_match[1]
  }
  return field
}

function normalize (string) {
  return string.replace(/['`"]/ig, '')
}