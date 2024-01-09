import { NextFunction, Request, Response } from 'express'
import { GetConversationParams } from '~/models/requests/Conversation.requests'
import conversationService from '~/services/conversation.services'

export const getConversationController = async (
  req: Request<GetConversationParams, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { receiver_id } = req.params
  const limit = parseInt(req.query.limit as string)
  const page = parseInt(req.query.page as string)
  const sender_id = req.decoded_authorization?.user_id as string
  const data = await conversationService.getConversation({
    sender_id,
    receiver_id,
    limit,
    page
  })
  return res.json({
    data: {
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      conversations: data.conversations
    },
    message: 'Get conversation successfully'
  })
}
