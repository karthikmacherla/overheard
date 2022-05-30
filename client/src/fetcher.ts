import { Group, Quote, User, Comment, UserMetadata } from './models';

const host = process.env.REACT_APP_SERVER_HOST;
const endpoint = `${host}`

console.log("hi this worked");
console.log(`endpoint ${endpoint}`);
console.log(process.env);


const signup = async (email: string, name: string, password: string) => {
  let body = {
    'email': email,
    'name': name,
    'password': password
  }

  let res = await fetch(`${endpoint}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  checkAuthorization(res);

  if (!res.ok) {
    throw new Error("unable to create account");
  }

  return res;
}

// get user info 
const getuser = async (access_token: string) => {
  return await fetch(`${endpoint}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
}


const get_user_complete = async (access_token: string): Promise<User> => {
  let res = await fetch(`${endpoint}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  let user = await res.json();

  if (!user.id) {
    throw new Error('Bad access token');
  }
  return user;
}

const username_sign_in = async (email: string, password: string) => {
  let body = { 'email': email, 'password': password };

  let token = await fetch(`${endpoint}/auth/username-json`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
  if (!token.access_token) {
    return { "error": "Incorrect username/password" }
  }

  let access_token = token.access_token;
  let user = await getuser(access_token).then(res => res.json());
  return { access_token, user }
}

const get_user_metadata = async (access_token: string): Promise<UserMetadata> => {
  let res = await fetch(`${endpoint}/user/metadata`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  let user = await res.json();

  if (!user.quote_count) {
    throw new Error('Bad access token');
  }
  return user;
}

// create group
const create_group = async (group_name: string, description: string, access_token: string): Promise<Group> => {
  let body = { "group_name": group_name, "description": description }

  let res = await fetch(`${endpoint}/group/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!res.ok) {
    throw new Error("Group couldn't be created");
  }

  let group = await res.json();
  return group;
}


const join_group = async (group_code: string, access_token: string): Promise<Group> => {
  let body = { "group_code": group_code }

  let res = await fetch(`${endpoint}/group/join`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  if (res.status === 406) {
    throw new Error("Invalid group code.");
  } else if (!res.ok) {
    throw new Error("Cannot join group with code.");
  }

  let group = await res.json();

  return group;
}

const delete_group = async (group_id: number, access_token: string): Promise<boolean> => {
  let body = { "id": group_id }

  let res = await fetch(`${endpoint}/group/delete`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  if (res.status === 406) {
    throw new Error("Invalid group code.");
  } else if (!res.ok) {
    throw new Error("Cannot join group with code.");
  }

  let is_successful = await res.json();

  return is_successful;
}

// get groups for user
const get_user_groups = async (access_token: string): Promise<Array<Group>> => {
  let resp = await fetch(`${endpoint}/group/list_by_user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!resp.ok) {
    throw new Error("request failed")
  }
  let groups = await resp.json();

  if (groups.detail)
    throw new Error("Bad access token")

  return groups;
}

const get_users_in_group = async (group_id: number, access_token: string): Promise<Array<User>> => {
  let resp = await fetch(`${endpoint}/group/users?group_id=${group_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(resp);
  if (resp.status === 422)
    throw new Error("Invalid request params");
  else if (!resp.ok)
    throw new Error("request failed")

  let users = await resp.json();
  return users;
}

const remove_user_from_group = async (user_id: number, group_id: number, access_token: string): Promise<boolean> => {
  let body = { user_id, group_id };

  let res = await fetch(`${endpoint}/group/remove_user`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  if (!res.ok) {
    throw new Error("Error removing user from group.");
  }

  let is_successful = await res.json();

  return is_successful;
}

// create quote for group
const create_quote = async (quote: string, group_id: number, access_token: string) => {
  let body = { "message": quote, "group_id": group_id }

  return await fetch(`${endpoint}/quote/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
}


// get quotes for group
const get_group_quotes = async (group_id: number, access_token: string): Promise<Array<Quote>> => {
  let res = await fetch(`${endpoint}/quote/list_by_group?group_id=${group_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  let quotes = await res.json();
  if (quotes.detail) {
    throw new Error("Bad params");
  }

  return quotes;
}

const get_user_quotes = async (access_token: string): Promise<Array<Quote>> => {
  let res = await fetch(`${endpoint}/quote/list_by_user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  let quotes = await res.json();
  if (quotes.detail) {
    throw new Error("Bad params");
  }

  return quotes;
}


const get_comments_for_quotes = async (quote_id: number, access_token: string): Promise<Array<Comment>> => {
  let res = await fetch(`${endpoint}/comment/list_by_quote?quote_id=${quote_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  let quotes = await res.json();
  if (quotes.detail) {
    throw new Error("Bad params");
  }

  return quotes;
}

const create_comment = async (comment: string, quote_id: number, access_token: string) => {
  let body = { "message": comment, "quote_id": quote_id }

  let res = await fetch(`${endpoint}/comment/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  comment = await res.json();
  console.log(comment);

  if (!res.ok) {
    throw new Error("Comment couldn't be created");
  }

  comment = await res.json();
  return comment;
}


const delete_comment = async (comment_id: number, access_token: string): Promise<boolean> => {
  let res = await fetch(`${endpoint}/comment/delete?comment_id=${comment_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  if (!res.ok) {
    throw new Error("Cannot delete comment");
  }

  let is_successful = await res.json();
  return is_successful;
}


const update_user_details = async (access_token: string, file: File, name: string): Promise<User> => {
  let body = new FormData();
  if (file != null)
    body.append('imageFile', file);
  body.append('test', 'hi');

  let res = await fetch(`${endpoint}/user/update?name=${name}`, {
    method: 'POST',
    body: body,
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  let user = await res.json();
  return user;
}

const get_quote = async (access_token: string, quote_id: number): Promise<Quote> => {
  let res = await fetch(`${endpoint}/quote?id=${quote_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  console.log(res.status);
  console.log(res);

  if (!res.ok) {
    throw new Error(`Unable to get quote at this time. Please try again later. ${res.statusText}`)
  }

  if (res.status === 404) {
    throw new Error("heyoo");
  }

  let quote = await res.json();
  return quote;
}

const toggleLikeQuote = async (access_token: string, quote_id: number, like: boolean): Promise<boolean> => {
  var url = like ? `${endpoint}/quote/like?id=${quote_id}` : `${endpoint}/quote/unlike?id=${quote_id}`;

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  checkAuthorization(res);

  console.log(res.status);
  console.log(res);


  if (!res.ok) {
    throw new Error(`Unable to get quote at this time. Please try again later. ${res.statusText}`)
  }

  if (res.status === 404) {
    throw new Error("Not found");
  }

  let confirm = await res.json();

  return confirm;
}




function checkAuthorization(res: Response) {
  if (res.status === 401) {
    throw new Error("User logged out or does not have permission to fetch this content");
  }
  return;
}

// function checkBadParams(res: Response) {
//   if (res.status === )
// }

export {
  signup,
  getuser,
  delete_group,
  delete_comment,
  create_comment,
  get_comments_for_quotes,
  username_sign_in,
  get_user_complete,
  create_group,
  join_group,
  create_quote,
  get_group_quotes,
  get_user_quotes,
  get_user_groups,
  get_user_metadata,
  get_users_in_group,
  remove_user_from_group,
  update_user_details,
  toggleLikeQuote,
  get_quote
}

