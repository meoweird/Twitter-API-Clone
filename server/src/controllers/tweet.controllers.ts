import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enum'
import { PaginationQuery, TweetParams, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetService from '~/services/tweet.services'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const data = await tweetService.createTweet(user_id, req.body)
  return res.json({
    message: 'Tweet created successfully',
    data
  })
}

export const getTweetController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { tweet_id } = req.params
  const views = await tweetService.increaseView(tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: views.guest_views,
    user_views: views.user_views,
    updated_at: views.updated_at
  }
  return res.json({
    message: 'Get tweet successfully',
    data: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParams, any, any, TweetQuery>, res: Response) => {
  const { tweet_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_type = parseInt(req.query.tweet_type) as TweetType
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)
  const { tweets, total } = await tweetService.getTweetChildren({ tweet_id, limit, page, tweet_type, user_id })
  return res.json({
    message: 'Get tweet children successfully',
    data: {
      tweets,
      tweet_type,
      page,
      limit,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (
  req: Request<ParamsDictionary, any, any, PaginationQuery>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)
  const result = await tweetService.getNewFeeds({ user_id, limit, page })
  return res.json({
    message: 'Get new feeds successfully',
    data: {
      tweets: result.tweets,
      page,
      limit,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
