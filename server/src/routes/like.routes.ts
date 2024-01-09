import { Router } from 'express'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { likeTweetController } from '~/controllers/like.controllers'
import { unlikeTweetController } from '~/controllers/like.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'

const likeRouter = Router()
/*
 * Description. Like a tweet
 * Path: /
 * Method: POST
 * Body: LikeTweetReqBody
 * Headers: { Authorization:Bearer <access_token> }
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/*
 * Description. Unlike a tweet
 * Path: /tweets/:tweetId
 * Method: DELETE
 * Body: LikeTweetReqBody
 * Headers: { Authorization:Bearer <access_token> }
 */
likeRouter.delete(
  '/tweets/:tweetID',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likeRouter
