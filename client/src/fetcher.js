import config from './config.json'
import fetch from 'node-fetch'

const endpoint = `http://${config.server_host}:${config.server_port}`
// const endpoint = `http://localhost:8000`


const signup = async (email, name, password) => {
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
const getuser = async (access_token) => {
  return await fetch(`${endpoint}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
}

// create group
const create_group = async (group_name, description, access_token) => {
  let body = { "group_name": group_name, "description": description }

  return await fetch(`${endpoint}/group/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });

}

// get groups for user
const get_user_groups = async (access_token) => {
  return await fetch(`${endpoint}/group/list_by_user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
}


// create quote for group
const create_quote = async (quote, group_id, access_token) => {
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
const get_group_quotes = async (group_id, access_token) => {
  return await fetch(`${endpoint}/quote/list_by_group?group_id=${group_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
}





function run() {
  let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJleHAiOjE2NDU5MjUxMTZ9.zPFscTkd6OMHkc0GHoMZ2fVUubMcpB4qPSlMGBt5fCo'

  get_group_quotes(2, access_token)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(e => console.log(e));
}



run()
