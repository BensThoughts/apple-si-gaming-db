"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/winston-logger.ts
var import_winston = require("winston");
var { prettyPrint, timestamp, combine, json } = import_winston.format;
var logger = (0, import_winston.createLogger)({
  level: "debug",
  format: json(),
  transports: [
    new import_winston.transports.File({ filename: "./logs/error.log", level: "error" }),
    new import_winston.transports.Console({
      format: combine(
        timestamp({ format: `MM-DD-YYYY [at] HH:mm:ss` }),
        prettyPrint({ colorize: true })
      )
    })
  ]
});
var winston_logger_default = logger;

// src/index.ts
var src_default = winston_logger_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map