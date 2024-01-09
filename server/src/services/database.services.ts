import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follow.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'
import Conversation from '~/models/schemas/Conversation.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter-api.glzmhgo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
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
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_COLLECTION_FOLLOWERS as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_COLLECTION_VIDEO_STATUS as string)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_COLLECTION_TWEETS as string)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_COLLECTION_HASHTAGS as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_COLLECTION_BOOKMARKS as string)
  }

  get likes(): Collection<Like> {
    return this.db.collection(process.env.DB_COLLECTION_LIKES as string)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(process.env.DB_COLLECTION_CONVERSATIONS as string)
  }

  async indexUsers() {
    const exists = await this.db
      .collection(process.env.DB_COLLECTION_USERS as string)
      .indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.db.collection(process.env.DB_COLLECTION_USERS as string).createIndex({ email: 1, password: 1 })
      this.db.collection(process.env.DB_COLLECTION_USERS as string).createIndex({ email: 1 }, { unique: true })
      this.db.collection(process.env.DB_COLLECTION_USERS as string).createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshTokens() {
    const exists = await this.db
      .collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
      .indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string).createIndex({ token: 1 })
      this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string).createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }
  async indexVideoStatus() {
    const exists = await this.db.collection(process.env.DB_COLLECTION_VIDEO_STATUS as string).indexExists(['name_1'])

    if (!exists) {
      this.db.collection(process.env.DB_COLLECTION_VIDEO_STATUS as string).createIndex({ name: 1 })
    }
  }
  async indexFollowers() {
    const exists = await this.db
      .collection(process.env.DB_COLLECTION_FOLLOWERS as string)
      .indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.db.collection(process.env.DB_COLLECTION_FOLLOWERS as string).createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }
  async indexTweets() {
    const exists = await this.db
      .collection(process.env.DB_COLLECTION_TWEETS as string)
      .indexExists(['user_id_1_created_at_1'])
    if (!exists) {
      this.db
        .collection(process.env.DB_COLLECTION_TWEETS as string)
        .createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
