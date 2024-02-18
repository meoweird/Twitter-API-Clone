import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follow.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'
import Conversation from '~/models/schemas/Conversation.schema'
import { envConfig } from '~/constants/config'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter-api.glzmhgo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  public async connect() {
    try {
      this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      throw new Error('Unable to connect to MongoDB cluster')
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbCollectionUsers)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbCollectionRefreshTokens)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbCollectionFollowers)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbCollectionVideoStatus)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbCollectionTweets)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbCollectionHashtags)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbCollectionBookmarks)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbCollectionLikes)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbCollectionConversations)
  }

  async indexUsers() {
    const exists = await this.db
      .collection(envConfig.dbCollectionUsers)
      .indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.db.collection(envConfig.dbCollectionUsers).createIndex({ email: 1, password: 1 })
      this.db.collection(envConfig.dbCollectionUsers).createIndex({ email: 1 }, { unique: true })
      this.db.collection(envConfig.dbCollectionUsers).createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshTokens() {
    const exists = await this.db.collection(envConfig.dbCollectionRefreshTokens).indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.db.collection(envConfig.dbCollectionRefreshTokens).createIndex({ token: 1 })
      this.db.collection(envConfig.dbCollectionRefreshTokens).createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }
  async indexVideoStatus() {
    const exists = await this.db.collection(envConfig.dbCollectionVideoStatus).indexExists(['name_1'])

    if (!exists) {
      this.db.collection(envConfig.dbCollectionVideoStatus).createIndex({ name: 1 })
    }
  }
  async indexFollowers() {
    const exists = await this.db
      .collection(envConfig.dbCollectionFollowers)
      .indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.db.collection(envConfig.dbCollectionFollowers).createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }
  async indexTweets() {
    const exists = await this.db.collection(envConfig.dbCollectionTweets).indexExists(['user_id_1_created_at_1'])
    if (!exists) {
      this.db.collection(envConfig.dbCollectionTweets).createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
