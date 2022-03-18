interface User {
  email: string,
  name: string,
  id: number,
  profile_pic_url?: String,
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
  message: string,
  share_link?: URL | string,
  time?: Date,
  likes?: number,
}

interface Comment {
  message: string,
  time?: Date
}


export type { User, Group, Quote, Comment }