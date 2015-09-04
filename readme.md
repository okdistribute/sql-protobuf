# sql-protobuf

Convert a sql CREATE TABLE statement into a protobuf schema

[![NPM](https://nodei.co/npm/sql-protobuf.png)](https://nodei.co/npm/sql-protobuf/)

Covert:
```
CREATE TABLE "pluto" (
  "boroughtext" text,
  "block" integer,
  "lot" bigint,
  "cd" date,
  "ct2010" text,
);
```

TO

```
syntax = "proto2";

message pluto {
  optional string "boroughtext" text = 0;
  optional int32 "block" integer = 1;
  optional int32 "lot" integer = 2;
  optional int32 "cd" integer = 3;
  optional string "ct2010" text = 4;
  optional int32 "cb2010" integer = 5;
```



# TODO

Need more example sql schemas
