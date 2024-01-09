import databaseService from './database.services'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { config } from 'dotenv'
import { LoginReqBody, RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import axios from 'axios'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
config()

class UserService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AcccessToken, verify },
      secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        secret: process.env.JWT_REFRESH_TOKEN_SECRET as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken, verify },
      secret: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string,
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      secret: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string
    })
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId().toString()
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: new ObjectId(user_id),
        username: `user${user_id}}`,
        email_verify_token: email_verify_token as string,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // console.log('email_verify_token: ', email_verify_token)
    await sendVerifyRegisterEmail(payload.email, email_verify_token as string)
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token as string)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, iat, exp })
    )
    return { access_token, refresh_token }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token as string)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, iat, exp })
    )
    return { access_token, refresh_token }
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getOauthGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getOauthGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email)
      throw new ErrorWithStatus({ message: USERS_MESSAGES.GMAIL_NOT_VERIFIED, status: HTTP_STATUS.BAD_REQUEST })
    const user = await databaseService.users.findOne({ email: userInfo.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })
      const { iat, exp } = await this.decodeRefreshToken(refresh_token as string)

      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: new ObjectId(user._id.toString()), token: refresh_token as string, iat, exp })
      )
      return {
        access_token,
        refresh_token,
        newUser: 0,
        verify: user.verify
      }
    } else {
      const password = Math.random().toString(36).substring(2, 15)
      const data = await this.register({
        name: userInfo.name,
        email: userInfo.email,
        password,
        confirm_password: password,
        date_of_birth: new Date().toString()
      })
      return {
        ...data,
        newUser: 1,
        verify: UserVerifyStatus.Verified
      }
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESSFULLY }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: { email_verify_token: '', verify: UserVerifyStatus.Verified },
          $currentDate: { updated_at: true }
        }
      )
    ])
    const [access_token, refresh_token] = token
    const { iat, exp } = await this.decodeRefreshToken(refresh_token as string)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, iat, exp })
    )
    return { access_token, refresh_token }
  }

  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    // console.log('Resend verify email: ', email_verify_token)
    await sendVerifyRegisterEmail(email, email_verify_token as string)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: email_verify_token as string },
        $currentDate: { updated_at: true }
      }
    )
    return { message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFULLY }
  }

  async forgotPassword({ user_id, verify, email }: { user_id: string; verify: UserVerifyStatus; email: string }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token: forgot_password_token as string },
        $currentDate: { updated_at: true }
      }
    )
    // console.log('forgot_password_token: ', forgot_password_token)
    await sendForgotPasswordEmail(email, forgot_password_token as string)
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(password), forgot_password_token: '' },
        $currentDate: { updated_at: true }
      }
    )
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFULLY }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (user === null)
      throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    return user
  }

  async follow(user_id: string, followed_user_id: string) {
    const following = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (following === null) {
      await databaseService.followers.insertOne({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
      return { message: USERS_MESSAGES.FOLLOW_SUCCESSFULLY }
    } else return { message: USERS_MESSAGES.ALREADY_FOLLOWED }
  }

  async unfollow(user_id: string, followed_user_id: string) {
    const following = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (following === null) return { message: USERS_MESSAGES.NOT_FOLLOWED_YET }
    else {
      await databaseService.followers.deleteOne({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
      return { message: USERS_MESSAGES.UNFOLLOW_SUCCESSFULLY }
    }
  }

  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(new_password) },
        $currentDate: { updated_at: true }
      }
    )
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFULLY }
  }

  async refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }: {
    user_id: string
    refresh_token: string
    verify: UserVerifyStatus
    exp?: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const { iat, exp: new_exp } = await this.decodeRefreshToken(new_refresh_token as string)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token as string, iat, exp: new_exp })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async checkExistEmail(email: string) {
    const existEmail = await databaseService.users.findOne({ email })
    if (existEmail) return true
  }
}

const userService = new UserService()
export default userService
