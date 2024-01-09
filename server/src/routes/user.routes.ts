import { Router } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  changePasswordController,
  emailVerifyTokenController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/user.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator,
  verifyUserValidator
} from '~/middlewares/user.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description. Login
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Query: { code: string }
 */
userRouter.get('/oauth/google', wrapRequestHandler(oauthController))

/**
 * Description. Logout
 * Path: /logout
 * Method: POST
 * Body: { refresh_token: string }
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description. Verify email when user clicks on the link in the email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyTokenController))

/**
 * Description. Resend verify email
 * Path: /verify-email
 * Method: POST
 * Body:{}
 * Header: { Authorization: Bearer <access_token>
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body:{email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description. Verify forgot password token
 * Path: /verify-forgot-password
 * Method: POST
 * Body:{forgot_password_token: string}
 */
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 * Description. Reset password
 * Path: /reset-password
 * Method: POST
 * Body:{forgot_password_token: string, password: string, confirm_password: string}
 */
userRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description. Get me
 * Path: /me
 * Method: GET
 * Body:{}
 * Header: { Authorization: Bearer <access_token>
 */
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description. Update profile
 * Path: /me
 * Method: PATCH
 * Body:UserSchema
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.patch(
  '/me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description. Get profile
 * Path: /:username
 * Method: GET
 * Body:{}
 */
userRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description. Follow someone
 * Path: /follow
 * Method: POST
 * Body:{follow_user_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description. Unfollow someone
 * Path: /follow/:user_id
 * Method: DELETE
 * Params:{user_id:string}
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 * Description. Change password
 * Path: /change-password
 * Method: PUT
 * Body:{old_password: string, new_password: string, confirm_new_password: string}
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/**
 * Description. Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default userRouter
