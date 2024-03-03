import { getVersionInfo } from "./index";
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for performing a health check plus operation.
 * Retrieves version and latest commit information and sends it as a JSON response.
 * These health checks are available out of the box:
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
async function healthCheckPlus(req: Request, res: Response, next: NextFunction) {
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
        const versionInfo = await getVersionInfo();
        res.status(200).send(JSON.stringify(versionInfo, null, 2));
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(501).send(JSON.stringify({ error: error }, null, 2));
  }
  next();
}

export { healthCheckPlus };
