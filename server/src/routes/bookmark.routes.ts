import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmark.controllers'
import { unbookmarkTweetController } from '~/controllers/bookmark.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarkRouter = Router()
/*
 * Description. Create a new bookmark
 * Path: /
 * Method: POST
 * Body: BookmarkTweetReqBody
 * Headers: { Authorization:Bearer <access_token> }
 */
bookmarkRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/*
 * Description. Unbookmark a tweet
 * Path: /tweets/:tweetId
 * Method: DELETE
 * Body: BookmarkTweetReqBody
 * Headers: { Authorization:Bearer <access_token> }
 */
bookmarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarkRouter
