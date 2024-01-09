import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { TweetType, MediaType, TweetAudience, UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/common'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const tweetTypes = numberEnumToArray(TweetType)
const mediaTypes = numberEnumToArray(MediaType)
const tweetAudiences = numberEnumToArray(TweetAudience)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [tweetAudiences],
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type
            // Nếu không phải là tweet gốc thì phải có parent_id và parent_id phải là tweet_id của tweet gốc
            if (
              [TweetType.Comment, TweetType.QuoteTweet, TweetType.Retweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_VALID)
            }

            // Nếu là tweet gốc thì không được có parent_id
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }

            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type
            const hashtags = req.body.hashtags
            const mentions = req.body.mentions
            // Nếu `type` là comment, quotetweet, tweet và không có `mentions` và `hashtags` thì `content` phải là string và không được rỗng
            if (
              [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_STRING)
            }

            // Nếu `type` là retweet thì content phải rỗng
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY)
            }

            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            // Mỗi hashtag trong Array phải là string
            if (!value.every((hashtag: any) => typeof hashtag === 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAG_MUST_BE_STRING)
            }

            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            // Mỗi mention trong Array phải là string
            if (!value.every((mention: any) => typeof mention === 'string')) {
              throw new Error(TWEETS_MESSAGES.MENTION_MUST_BE_STRING)
            }

            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            // Mỗi media trong Array phải là string
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const tweetIdValidator = validate(
  checkSchema({
    tweet_id: {
      custom: {
        options: async (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: TWEETS_MESSAGES.INVALID_TWEET_ID })
          }
          const [tweet] = await databaseService.tweets
            .aggregate<Tweet>([
              {
                $match: {
                  _id: new ObjectId(value)
                }
              },
              {
                $lookup: {
                  from: 'hashtags',
                  localField: 'hashtags',
                  foreignField: '_id',
                  as: 'hashtags'
                }
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'mentions',
                  foreignField: '_id',
                  as: 'mentions'
                }
              },
              {
                $addFields: {
                  mentions: {
                    $map: {
                      input: '$mentions',
                      as: 'mention',
                      in: {
                        _id: '$$mention._id',
                        name: '$$mention.name',
                        username: '$$mention.username',
                        email: '$$mention.email'
                      }
                    }
                  }
                }
              },
              {
                $lookup: {
                  from: 'bookmarks',
                  localField: '_id',
                  foreignField: 'tweet_id',
                  as: 'bookmarks'
                }
              },
              {
                $lookup: {
                  from: 'likes',
                  localField: '_id',
                  foreignField: 'tweet_id',
                  as: 'likes'
                }
              },
              {
                $lookup: {
                  from: 'tweets',
                  localField: '_id',
                  foreignField: 'parent_id',
                  as: 'tweet_children'
                }
              },
              {
                $addFields: {
                  bookmarks: {
                    $size: '$bookmarks'
                  },
                  likes: {
                    $size: '$likes'
                  },
                  retweet_count: {
                    $size: {
                      $filter: {
                        input: '$tweet_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.Retweet]
                        }
                      }
                    }
                  },
                  comment_count: {
                    $size: {
                      $filter: {
                        input: '$tweet_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.Comment]
                        }
                      }
                    }
                  },
                  quote_count: {
                    $size: {
                      $filter: {
                        input: '$tweet_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.QuoteTweet]
                        }
                      }
                    }
                  }
                }
              },
              {
                $project: {
                  tweet_children: 0
                }
              }
            ])
            .toArray()
          if (!tweet) {
            throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: TWEETS_MESSAGES.TWEET_NOT_FOUND })
          }
          ;(req as Request).tweet = tweet
          return true
        }
      }
    }
  })
)

export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.UNAUTHORIZED, message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED })
    }
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    })
    if (!author || author.verify === UserVerifyStatus.Banned) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: USERS_MESSAGES.USER_NOT_FOUND })
    }
    const audienceId = req.decoded_authorization.user_id
    const isInTwitterCircle = author.twitter_circle.some((user_circle_id) => user_circle_id.equals(audienceId))
    if (!isInTwitterCircle && !author._id.equals(audienceId)) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: TWEETS_MESSAGES.TWEET_NOT_PUBLIC })
    }
  }
  next()
})

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      }
    },
    ['query']
  )
)

export const paginationValidator = validate(
  checkSchema({
    limit: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          if (parseInt(value) < 1 || parseInt(value) > 100) {
            throw new Error(TWEETS_MESSAGES.LIMIT_MUST_BE_GREATER_THAN_0_AND_LESS_THAN_100)
          }
          return true
        }
      }
    },
    page: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          if (parseInt(value) < 1) {
            throw new Error(TWEETS_MESSAGES.PAGE_MUST_BE_GREATER_THAN_0)
          }
          return true
        }
      }
    }
  })
)
