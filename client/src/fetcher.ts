import { Group, User } from './models';

// TODO: Fix this 
// const endpoint = `http://${config.server_host}:${config.server_port}`
const endpoint = `http://localhost:8000`


const signup = async (email: string, name: string, password: string) => {
  let body = {
    'email': email,
    'name': name,
    'password': password
  }

  return await fetch(`${endpoint}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
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
    throw Error("Group couldn't be created");
  }

  let group = await res.json();
  return group;
}

// get groups for user
const get_user_groups = async (access_token: string) => {
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
const get_group_quotes = async (group_id: number, access_token: string) => {
  return await fetch(`${endpoint}/quote/list_by_group?group_id=${group_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
}

export {
  signup,
  getuser,
  username_sign_in,
  get_user_complete,
  create_group,
  create_quote,
  get_group_quotes,
  get_user_groups
}

