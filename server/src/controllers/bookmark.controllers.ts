import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmark.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const data = await bookmarkService.bookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.TWEET_BOOKMARKED_SUCCESSFULLY,
    data
  })
}

export const unbookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.params
  await bookmarkService.unbookmarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.TWEET_UNBOOKMARKED_SUCCESSFULLY
  })
}
