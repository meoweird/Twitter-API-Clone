import { checkSchema } from 'express-validator'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content must be string'
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: `Media type must be one of ${Object.values(MediaTypeQuery).join(', ')}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: `People follow must be one of ${Object.values(PeopleFollow).join(', ')}`
        }
      }
    },
    ['query']
  )
)
