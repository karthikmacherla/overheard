# Tasks
- design databases
- design routes
- implement routes

# Implementation
- figure out how sql boiler is made
- figure out how models connect to response models
- set up SQL boiler
- start writing routes


# Routes
- get groups from user
- get quotes in group (w/ pagination)
- get quotes in local group (w/ pagination)
- get comments of quote

- CUD group
- CUD comments of quote
- CRUD quote
- CRUD user


# Databases
Groups
  - group_name
  - description
  - creator_id

Users
  - user_id
  - email
  - hash(pwd)
  - name

UserGroups
  - user_id
  - group_id

Quotes
  - message
  - date/time
  - map of reacts
  - num_likes
  - group_id
  - creator_id
  - geohash

Comments:
  - quote_id
  - message
  - creator_id
  - likes
  - date/time
