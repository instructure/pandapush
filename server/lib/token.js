const crypto = require("crypto");

/**
 * Generates an alphanumeric cryptographically random string of
 * the specified length.
 *
 * @param length [Int] The number of characters to generate
 * @callback cb [function(token)]
 *   @param token [String] The generated token
 */
exports.generate = function(length, cb) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length * 2, function(ex, buf) {
      // converting the string to base64 will expand the size and put
      // in some characters we don't want... so we'll replace them and
      // then just get the requested string length.
      const result = buf
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);

      if (cb) {
        cb(result);
      }

      resolve(result);
    });
  });
};
