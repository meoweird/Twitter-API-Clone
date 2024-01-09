import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidator } from '~/middlewares/search.middlewares'
import { paginationValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouter = Router()

searchRouter.get(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  searchValidator,
  paginationValidator,
  wrapRequestHandler(searchController)
)

export default searchRouter
