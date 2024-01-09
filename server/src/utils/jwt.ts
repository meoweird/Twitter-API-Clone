import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  secret,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  secret: string
  options?: SignOptions
}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

export const verifyToken = ({ token, secret }: { token: string; secret: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) throw reject(err)
      resolve(decoded as TokenPayload)
    })
  })
}
