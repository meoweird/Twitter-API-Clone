import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/messages'
import { LikeTweetReqBody } from '~/models/requests/Like.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/like.services'

export const likeTweetController = async (
  req: Request<ParamsDictionary, any, LikeTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const data = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGES.TWEET_LIKED_SUCCESSFULLY,
    data
  })
}

export const unlikeTweetController = async (
  req: Request<ParamsDictionary, any, LikeTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.params
  await likeService.unlikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGES.TWEET_UNLIKED_SUCCESSFULLY
  })
}
