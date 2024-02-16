export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  EMAIL_INVALID: 'Email is invalid',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_EXISTS: 'Email already exists',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_INVALID: 'Password is invalid',
  PASSWORD_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_STRONG: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_INVALID: 'Confirm password is invalid',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be at least 6 characters and maximum 50 characters',
  CONFIRM_PASSWORD_STRONG: 'Confirm password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
  NAME_REQUIRED: 'Name is required',
  NAME_INVALID: 'Name is invalid',
  DATE_OF_BIRTH_REQUIRED: 'Date of birth is required',
  NAME_LENGTH: 'Name must be at least 1 characters and maximum 100 characters',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601 format',
  REGISTER_SUCCESSFULLY: 'Register successfully',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  USER_NOT_FOUND: 'User not found',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_NOT_FOUND_OR_USED: 'Refresh token not found or used',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_NOT_EXISTS_OR_ALREADY_VERIFIED: 'Email not exists or already verified',
  USER_ALREADY_VERIFIED: 'User already verified',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFULLY: 'Verify forgot password token successfully',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  GET_ME_SUCCESSFULLY: 'Get me successfully',
  USER_NOT_VERIFIED: 'User not verified',
  IMAGE_MUST_BE_STRING: 'Image must be string',
  IMAGE_LENGTH: 'Image must be at least 1 characters and maximum 400 characters',
  BIO_LENGTH: 'Bio must be maximum 200 characters',
  BIO_MUST_BE_STRING: 'Bio must be string',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENGTH: 'Location must be maximum 200 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENGTH: 'Website must be maximum 200 characters',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_LENGTH: 'Username must be maximum 20 characters',
  UPDATE_ME_SUCCESSFULLY: 'Update me successfully',
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  FOLLOW_USER_ID_INVALID: 'Follow user id is invalid',
  FOLLOW_SUCCESSFULLY: 'Follow successfully',
  ALREADY_FOLLOWED: 'Already followed',
  UNFOLLOW_SUCCESSFULLY: 'Unfollow successfully',
  NOT_FOLLOWED_YET: 'Not followed yet',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  USERNAME_EXISTS: 'Username already exists',
  PASSWORD_DOES_NOT_MATCH: 'Password does not match',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_SUCCESSFULLY: 'Upload successfully',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  GET_VIDEO_STATUS_SUCCESSFULLY: 'Get video status successfully',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully'
} as const

export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Type is invalid',
  INVALID_AUDIENCE: 'Audience is invalid',
  PARENT_ID_MUST_BE_VALID: 'Parent id must be valid',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_STRING: 'Content must be string',
  CONTENT_MUST_BE_EMPTY: 'Content must be empty',
  HASHTAG_MUST_BE_STRING: 'Hashtag must be string',
  MENTION_MUST_BE_STRING: 'Mention must be string',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found',
  TWEET_NOT_PUBLIC: 'Tweet not public',
  LIMIT_MUST_BE_GREATER_THAN_0_AND_LESS_THAN_100: 'Limit must be greater than 0 and less than 100',
  PAGE_MUST_BE_GREATER_THAN_0: 'Page must be greater than 0'
} as const

export const BOOKMARKS_MESSAGES = {
  TWEET_BOOKMARKED_SUCCESSFULLY: 'Tweet bookmarked successfully',
  TWEET_UNBOOKMARKED_SUCCESSFULLY: 'Tweet unbookmarked successfully'
} as const

export const LIKES_MESSAGES = {
  TWEET_LIKED_SUCCESSFULLY: 'Tweet liked successfully',
  TWEET_UNLIKED_SUCCESSFULLY: 'Tweet unliked successfully'
} as const
