import { Router } from 'express'
import { WhiteLabelController } from '../controllers/WhiteLabelController'
import Passport from '../passport/Passport'
import Http from '../middlewares/Http'

export class WhiteLabelRoutes {
  public router: Router
  public whiteLabelController: WhiteLabelController = new WhiteLabelController()

  constructor() {
    this.router = Router()
    this.routes()
  }

  routes() {
    // Super admin routes
    this.router.post(
      '/create-white-label',
      Passport.authenticateJWT,
      Http.maintenance,
      this.whiteLabelController.createWhiteLabel
    )

    this.router.get(
      '/all-white-labels',
      Passport.authenticateJWT,
      Http.maintenance,
      this.whiteLabelController.getAllWhiteLabels
    )

    this.router.put(
      '/toggle-white-label/:whiteLabelId',
      Passport.authenticateJWT,
      Http.maintenance,
      this.whiteLabelController.toggleWhiteLabelStatus
    )

    // Admin routes (for current user's white-label)
    this.router.get(
      '/my-white-label',
      
      this.whiteLabelController.getCurrentUserWhiteLabel
    )

    this.router.put(
      '/update-white-label',
      Passport.authenticateJWT,
      Http.maintenance,
      this.whiteLabelController.updateWhiteLabel
    )

    // Public route to get white-label settings by domain
    this.router.get(
      '/domain/:domain',
      this.whiteLabelController.getWhiteLabelByDomain
    )

    // Get white-label by user ID
    this.router.get(
      '/user/:userId',
      Passport.authenticateJWT,
      Http.maintenance,
      this.whiteLabelController.getWhiteLabelByUserId
    )
  }
}