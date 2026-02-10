import { Request, Response, NextFunction } from 'express';
import { WhiteLabel } from '../models/WhiteLabel';

export const whiteLabelMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the host from the request
    const host = req.get('Host') || req.headers.host;
    if (!host) {
      // If no host header, continue without white-label
      return next();
    }

    // Extract just the domain (without port if present)
    const domain = host.split(':')[0]; // Remove port if present
    
    // Look up white-label settings for this domain
    const whiteLabel = await WhiteLabel.findOne({ 
      domain: domain.toLowerCase(), 
      isActive: true 
    }).populate('userId', 'username role');

    if (whiteLabel) {
      // Store white-label info in request for later use
      req.whiteLabel = whiteLabel;
    }

    next();
  } catch (error) {
    console.error('Error in white-label middleware:', error);
    // Continue without white-label if there's an error
    next();
  }
};

declare global {
  namespace Express {
    interface Request {
      whiteLabel?: any; // Add whiteLabel property to Request type
    }
  }
}