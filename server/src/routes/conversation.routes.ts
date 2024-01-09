import { Router } from 'express'
import { accessTokenValidator, getConversationValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { getConversationController } from '~/controllers/conversation.controllers'
import { paginationValidator } from '~/middlewares/tweet.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationRouter = Router()

conversationRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifyUserValidator,
  paginationValidator,
  getConversationValidator,
  wrapRequestHandler(getConversationController)
)

export default conversationRouter
