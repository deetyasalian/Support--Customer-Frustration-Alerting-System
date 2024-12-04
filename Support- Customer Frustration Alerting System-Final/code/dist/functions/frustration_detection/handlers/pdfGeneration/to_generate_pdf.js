"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.after_analysis = void 0;
const pdfGenerator_1 = require("./pdfGenerator");
// Generate the PDF report if analysis is successful
function after_analysis(analysis, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let filePath;
        if (analysis) {
            console.log("Analysis successful. Generating PDF...");
            filePath = yield (0, pdfGenerator_1.generatePDFReport)(analysis, data);
            console.log("PDF generated successfully.");
        }
        else {
            console.log("Analysis returned no result.");
        }
        return filePath;
    });
}
exports.after_analysis = after_analysis;
