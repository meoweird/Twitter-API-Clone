import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SearchQuery } from '~/models/requests/Search.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import searchService from '~/services/search.services'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)
  const { content, media_type, people_follow } = req.query
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await searchService.search({ content, limit, page, user_id, media_type, people_follow })
  return res.json({
    message: 'Search successfully',
    data: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
