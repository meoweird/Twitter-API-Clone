import { createHash } from 'crypto'

export const sha256 = (data: string) => {
  return createHash('sha256').update(data).digest('hex')
}

export const hashPassword = (password: string) => {
  return sha256(password + process.env.SALT)
}
