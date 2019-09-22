"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function whereCalledFrom() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack.slice(2);
    Error.prepareStackTrace = _;
    const caller = stack.find((c) => c.getFileName() !== null);
    return path.dirname(caller.getFileName());
}
exports.default = (handler) => {
    const dir = whereCalledFrom();
    const files = fs.readdirSync(dir);
    const actionable = files.filter((filename) => {
        const lowered = filename.toLowerCase();
        return !['index.js', 'index.ts'].includes(lowered) && !lowered.startsWith('.') && ['.ts', '.js'].includes(lowered.slice(-3));
    });
    return actionable.reduce((forExport, filename) => {
        const content = require(path.join(dir, filename));
        const e = handler({ filename: filename.substring(0, filename.length - 3), content: content.default || content });
        return Object.assign(Object.assign({}, forExport), e);
    }, {});
};
//# sourceMappingURL=dir-handler.js.map