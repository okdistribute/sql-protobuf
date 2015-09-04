# sql-protobuf

Convert a SQL CREATE TABLE statement into a protobuf schema.

[![NPM](https://nodei.co/npm/sql-protobuf.png)](https://nodei.co/npm/sql-protobuf/)

Parsing SQL with regex has been called 'almost impossible' -- but I like to think we can cover over 90% of the cases. There might be bugs. If this has trouble with a functioning SQL CREATE TABLE statement, let's try to fix it.

```
$ npm install -g sql-protobuf
```

Yes, this successfully handles:
  * Multiple CREATE TABLE statements in one file
  * NOT NULL
  * " and ` denotations for variable names
  * bigint
  * DEFAULT
  * case inSenSitIvIty
  * Statement defined in one line

No, this doesn't handle:
  * Anything other than CREATE TABLE statements
  * IF NOT EXISTS
  * Backwards compatibility
  * Non-basic SQL types

If the SQL type isn't found, it'll default to Protocol Buffers `string` type.

### CLI usage

```
$ sql-protobuf [input-file]
<...proto output...>
```

### Example

```
$ sql-protobuf schema.sql > schema.proto
```

schema.sql
```
CREATE TABLE "pluto" (
  "boroughtext" text,
  "block" integer,
  "lot" bigint,
  "cd" date NOT NULL,
);
```

schema.proto
```
syntax = "proto2";

message pluto {
  optional string boroughtext = 1;
  optional int32 block = 2;
  optional int64 lot = 3;
  required string cd = 4;
 }
```

### JS usage
```
var convert = require('sql-protobuf')
var file = fs.readFileSync('schema.sql').toString()
console.log(convert(file))
```

### TODO

Need more example sql schemas
