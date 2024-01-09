import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Bookmark from '~/models/schemas/Bookmark.schema'

class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const data = (await databaseService.bookmarks.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) },
      { $setOnInsert: new Bookmark({ user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) }) },
      { upsert: true, returnDocument: 'after' }
    )) as WithId<Bookmark>
    return data
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    const data = (await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })) as WithId<Bookmark>
    return data
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
