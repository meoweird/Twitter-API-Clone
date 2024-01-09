import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/media.controllers'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadImageController))

mediaRouter.post('/upload-video', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadVideoController))

mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(videoStatusController)
)

export default mediaRouter
