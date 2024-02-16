import express from 'express'
import databaseService from './services/database.services'
import userRouter from './routes/user.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/media.routes'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors from 'cors'
import tweetRouter from './routes/tweet.routes'
import bookmarkRouter from './routes/bookmark.routes'
import likeRouter from './routes/like.routes'
import searchRouter from './routes/search.routes'
import '~/utils/s3'
import { createServer } from 'http'
import conversationRouter from './routes/conversation.routes'
import initSocket from './utils/socket'
// import '~/utils/fake'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

initFolder()
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Twitter API Clone Documentation',
      version: '1.0.0',
      description: 'This is a project about cloning Twitter',
      termsOfService: 'http://swagger.io/terms/',
      contact: {
        email: 'meoweird.dev@gmail.com',
        name: 'meoweird',
        url: 'github.com/meoweird'
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      }
    }
  },
  apis: ['./openapi/*.yaml']
}
const openapiSpecification = swaggerJsdoc(options)

const PORT = process.env.PORT || 3000
const app = express()
const httpServer = createServer(app)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use(express.json())
app.use(cors())
app.use('/users', userRouter)
app.use('/tweets', tweetRouter)
app.use('/medias', mediaRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/conversations', conversationRouter)
app.use('/search', searchRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))

app.use(defaultErrorHandler)
initSocket(httpServer)

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
