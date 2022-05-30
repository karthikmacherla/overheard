interface User {
  email: string,
  name: string,
  id: number,
  profile_pic_url?: string,
}

interface Group {
  group_name: string,
  group_code: string,
  description?: string,
  id: number,
  owner_id: number,
  owner: User
}

interface Quote {
  id: number,
  message: string,
  share_link?: URL | string,
  time?: string,
  likes?: number,
  comment_count?: number,
  liked_by_user?: boolean,
  group?: Group
}

interface Comment {
  id: number,
  creator: User,
  likes: number,
  message: string,
  time?: string,
  quote_id: number
}

interface UserMetadata {
  like_count: number,
  quote_count: number
}


export type { User, Group, Quote, Comment, UserMetadata }