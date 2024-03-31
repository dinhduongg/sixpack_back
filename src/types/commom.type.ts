export type CommonQuery = {
  q: string
  page: string
  limit: string
}

export type TokenPayload = {
  id: string
  email: string
  sub: {
    name: string
  }
}

export type AdminDetail = {
  id: string
  name: string
  email: string
  token: string
  roles: string[]
}
