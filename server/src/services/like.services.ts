import { ObjectId, WithId } from 'mongodb'
import Like from '~/models/schemas/Like.schema'
import databaseService from './database.services'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const data = (await databaseService.likes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) },
      { $setOnInsert: new Like({ user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) }) },
      { upsert: true, returnDocument: 'after' }
    )) as WithId<Like>
    return data
  }

  async unlikeTweet(user_id: string, tweet_id: string) {
    const data = (await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })) as WithId<Like>
    return data
  }
}

const likeService = new LikeService()
export default likeService
