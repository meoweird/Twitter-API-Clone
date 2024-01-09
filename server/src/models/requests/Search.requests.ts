import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { PaginationQuery } from './Tweet.requests'

export interface SearchQuery extends PaginationQuery {
  content: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
