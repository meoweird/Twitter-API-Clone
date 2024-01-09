import { Router } from 'express'
import {
  createTweetController,
  getTweetController,
  getTweetChildrenController,
  getNewFeedsController
} from '~/controllers/tweet.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator
} from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetRouter = Router()
/**
 * Description. Create a new tweet
 * Path: /
 * Method: POST
 * Body: TweetRequestBody
 * Headers: { Authorization:Bearer <access_token> }
 */
tweetRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description. Get tweet detail
 * Path: /:tweet_id
 * Method: GET
 * Headers: { Authorization:Bearer <access_token> }
 */
tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Description. Get tweet children
 * Path: /:tweet_id/children
 * Method: GET
 * Headers: { Authorization:Bearer <access_token> }
 * Query: { limit: number, page: number, tweet_type: TweetType }
 */
tweetRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  paginationValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

/**
 * Description: Get new feeds
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { limit: number, page: number }
 */
tweetRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getNewFeedsController)
)
export default tweetRouter
