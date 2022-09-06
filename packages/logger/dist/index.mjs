// src/winston-logger.ts
import { createLogger, format, transports } from "winston";
var { prettyPrint, timestamp, combine, json } = format;
var logger = createLogger({
  level: "debug",
  format: json(),
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.Console({
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
export {
  src_default as default
};
//# sourceMappingURL=index.mjs.map