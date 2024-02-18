import { config } from 'dotenv'
import argv from 'minimist'
const options = argv(process.argv.slice(2))
config()

export const isProduction = Boolean(options.production)

export const envConfig = {
  port: process.env.PORT as string,
  host: process.env.HOST as string,
  // DB
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  dbCollectionUsers: process.env.DB_COLLECTION_USERS as string,
  dbCollectionRefreshTokens: process.env.DB_COLLECTION_REFRESH_TOKENS as string,
  dbCollectionVideoStatus: process.env.DB_COLLECTION_VIDEO_STATUS as string,
  dbCollectionFollowers: process.env.DB_COLLECTION_FOLLOWERS as string,
  dbCollectionTweets: process.env.DB_COLLECTION_TWEETS as string,
  dbCollectionConversations: process.env.DB_COLLECTION_CONVERSATIONS as string,
  dbCollectionHashtags: process.env.DB_COLLECTION_HASHTAGS as string,
  dbCollectionBookmarks: process.env.DB_COLLECTION_BOOKMARKS as string,
  dbCollectionLikes: process.env.DB_COLLECTION_LIKES as string,
  // JWT
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  jwtEmailVerifyTokenSecret: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string,
  jwtForgotPasswordTokenSecret: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  // OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,
  clientUrl: process.env.CLIENT_URL as string,
  // AWS
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_REGION as string,
  sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  s3BucketName: process.env.S3_BUCKET_NAME as string,
  // encode
  salt: process.env.SALT as string
} as const
