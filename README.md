# doug-news
>_A node.js backend server for a news app using psql_
_Built @ Northcoders!_
----

### Built with:
- Node.js
- Express
- Knex & node-pg

### TDD Tested using:
- Mocha
- Chai
- Supertest

---
# How to use
#### Clone this repository and enter directory
```bash
git clone git@github.com:douglashellowell/nc-news.git && cd ./nc-news
```
#### Install the node.js dependencies

**-either-** just the server:
```bash
npm install --only=prod
```
**-or-**  everything - including testing tools:
```bash
npm install
```
#### Create and database
```bash
npm run setup-dbs && npm run migrate:latest && npm run seed
```

#### Run server
```bash
npm start
```
> The console should print out...
> ```
> app is listening on port 9090 
> ```
> The server is now accepting requests on localhost:9090/
> Try making requests in your browser: 
> http://localhost:9090/api
> http://localhost:9090/api/topics
> http://localhost:9090/api/articles

---
## Functionality

### `GET: /api` 
> serves up a json representation of all the available endpoints of the api

### `GET: /api/topics`
> serves an array of topics in database

example response: 
```js
{
  topics: [
    { slug: 'UK', description: 'National and Local News'},
    { slug: 'Tech', description: 'Latest Software, Hardware and Tech Industry News' },
    { slug: 'Gaming', description: 'All things gaming' }
  ]
}
```
### `GET: /api/articles`
> serves an array of articles in database

example response:
```js
{
  "articles": [
    {
      "article_id": 1,
      "title": "Seafood substitutions are increasing",
      "topic": "UK",
      "author": "weegembump",
      "body": "Text from the article..",
      "created_at": 1527695953341,
      "comment_count": "13",
      "votes": 58
    },
    {
      "article_id": 2,
      "title": "Open to any Super Smash Bros Challenges...",
      "topic": "Gaming",
      "author": "doug123",
      "body": "Text from the article..",
      "created_at": 1527695953341,
      "comment_count": "17",
      "votes": 72
    }
  ]
}
```
### `GET: /api/articles/:article_id`
> serves an object with article data from specified article_id

```js
{ 
  "article":
    {
      "article_id": 1,
      "title": "Electron and Node.js on the desktop",
      "topic": "Tech",
      "author": "doug123",
      "body": "Text from the article..",
      "created_at": 1527695953341,
      "comment_count": "20",
      "votes": 97
    }
}
```

### `PATCH: /api/articles/:article_id`
> updates 'votes' of article and returns updated article to user

example patch data:
```js
{ inc_votes: 1 }
```
```js
{ inc_votes: -1 }
```
### `GET: /api/articles/:article_id/comments`
> serves an array of comments for specified article

example response:
```js
{
"comments": [
  {
    "comment_id": 14,
    "author": "icellusedkars",
    "article_id": 5,
    "votes": 16,
    "created_at": "2004-11-25T12:36:03.389Z",
    "body": "Really fascinating! I've got to use this in the future!"
  },
  {
    "comment_id": 15,
    "author": "butter_bridge",
    "article_id": 5,
    "votes": 1,
    "created_at": "2003-11-26T12:36:03.389Z",
    "body": "This is so funny i'm going to get it tattoo'd"
  }
]
}
```
### `POST: /api/articles/:article_id/comments`
> posts a comments associated with specified endpoint and responds with uploaded comment (user must exist)
example post:
```js
{
  "username": "broccoli55",
  "body": "This article is interesting!"
}
```
example response:
```js
{
  "comment": {
    "comment_id": 19,
    "author": "broccoli55",
    "article_id": 2,
    "votes": 0,
    "created_at": "2019-12-12T11:19:19.306Z",
    "body": "This article is interesting!"
  }
}
```
### `PATCH: api/comments/:comment_id`
> Updates 'votes' on specified comment and returns updated comment to user

example patch data:
```js
{ inc_votes: 1 }
```
```js
{ inc_votes: -1 }
```

---

# STOP!

If you have reached this point, go back and review all of the routes that you have created. Consider whether there are any errors that could occur that you haven't yet accounted for. If you identify any, write a test, and then handle the error. Even if you can't think of a specific error for a route, every controller that invokes a promise-based model should contain a `.catch` block to prevent unhandled promise rejections.

As soon as you think that you have handled all the possible errors that you can think of, let someone on the teaching team know. One of us will be able to take a look at your code and give you some feedback. While we are looking at your code, you can continue with the following:

# Continue...

---

```http
GET /api
```

#### Responds with

- JSON describing all the available endpoints on your API

---

### Step 3 - Hosting

Make sure your application and your database is hosted using Heroku

See the hosting.md file in this repo for more guidance

### Step 4 - README

Write a README for your project. Check out this [guide](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) for what sort of things should be included.

It should also include the link to where your Heroku app is hosted.

Take a look at GitHub's guide for [mastering markdown](https://guides.github.com/features/mastering-markdown/) for making it look pretty!

### Optional Extras

#### Pagination

To make sure that an API can handle large amounts of data, it is often necessary to use **pagination**. Head over to [Google](https://www.google.co.uk/search?q=cute+puppies), and you will notice that the search results are broken down into pages. It would not be feasible to serve up _all_ the results of a search in one go. The same is true of websites / apps like Facebook or Twitter (except they hide this by making requests for the next page in the background, when we scroll to the bottom of the browser). We can implement this functionality on our `/api/articles` and `/api/comments` endpoints.

```http
GET /api/articles
```

- Should accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
- add a `total_count` property, displaying the total number of articles (**this should display the total number of articles with any filters applied, discounting the limit**)

---

```http
GET /api/articles/:article_id/comments
```

Should accept the following queries:

- `limit`, which limits the number of responses (defaults to 10)
- `p`, stands for page which specifies the page at which to start (calculated using limit)

#### More Routes

```http
POST /api/articles

DELETE /api/articles/:article_id

POST /api/topics

POST /api/users
GET /api/users
```
