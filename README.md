# riddleMeThis

Created by Evan, Tray, Cameron

## Description

A riddle factory. Users can upload their own riddles with solutions, and view random riddles that have already been uploaded.

## Roles

* Unauthenticated
  * GET /riddle
  * GET /riddle/:id
  * GET /hint/:id
    * get's a hint for riddle with matching id, if there is one
  * GET /answer/:id
    * get's the answer to the riddle with matching id
  * POST /signup
  * POST /signin
* Editor
  * Unauthenticated routes
  * POST /riddle
    * create a new riddle
    * must include answer
  * PUT /riddle/:id
* Admin
  * Unauthenticated and Editor routes
  * DELETE /riddle/:id
    * deletes a riddle

## Routes

* /api
  * riddle
    * GET /riddle
    * GET /riddle/:id
    * POST /riddle
    * PUT /riddle/:id
    * DELETE /riddle/:id
  * answer
    * GET /answer/:id
  * hint
    * GET /hint/:id
* /auth
  * POST /signup
  * POST /signin

## Links to application deployment

Heroku: https://evan-cameron-tray-riddle-this.herokuapp.com/  
Github Pull Request: https://github.com/evan-woodworth/riddleMeThis/pull/13

## UML

![UML](./img/riddleMeThis.png)