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
exports.healthCheckPlus = void 0;
const index_1 = require("./index");
/**
 * Middleware function for performing a health check plus operation.
 * Retrieves version information and sends it as a JSON response.
 * These health checks are available out of the box.
 * This function serves the following health checks:
 * - '/HealthCheck'
 * - '/HealthCheck/'
 * - '/Health-Check'
 * - '/Health-Check/'
 * - '/health-check'
 * - '/health-check/'
 * - '/healthCheck'
 * - '/healthCheck/'
 * - '/health-check-plus'
 * - '/health-check-plus/'
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express NextFunction object.
 */
function healthCheckPlus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const endpoint = req.url;
            switch (endpoint) {
                // Valid endpoints for health check plus operation
                case '/HealthCheck':
                case '/HealthCheck/':
                case '/Health-Check':
                case '/Health-Check/':
                case '/health-check':
                case '/health-check/':
                case '/healthCheck':
                case '/healthCheck/':
                case '/health-check-plus':
                case '/health-check-plus/':
                    const versionInfo = yield (0, index_1.getVersionInfo)();
                    res.status(200).send(JSON.stringify(versionInfo, null, 2));
                    break;
            }
        }
        catch (error) {
            console.error(error);
            res.status(501).send(JSON.stringify({ error: error }, null, 2));
        }
        next();
    });
}
exports.healthCheckPlus = healthCheckPlus;
//# sourceMappingURL=middleware.js.map