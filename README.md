# BotaniBuddy-BE

This is a group project designed and coded by students at Northcoders. 
The link to the Front End project can be found here: https://github.com/rubyrubyruby02/BotaniBuddy-FE

Tech stack:  MongoDB, Express, Node.JS, Axios

# Endpoints: 
POST /api/login

POST /api/register

POST /api/users/user_id/add_by_search

POST /api/users/user_id/identify_plants_image 

GET /api/users/user_id/plants  

GET /api/users/user_id/plants/plant_id

GET /api/users/user_id/tasks

PATCH /api/users/user_id/tasks/plant_id


# Third-party API's:
- PlantNet  - providing image identification of plants
- Perenual  - providing plant information, note limitations with free-plan allowing only species 1 - 3000. 

# Dependancies
* axios@1.5.0
* bcrypt@5.1.1
* cors@2.8.5
* dayjs@1.11.10
* dotenv@16.3.1
* express-mongo-sanitize@2.2.0
* express@4.18.2
* fs@0.0.1-security
* jest-extended@4.0.1
* jest@29.7.0
* jsonwebtoken@9.0.2
* mongoose@7.5.2
* multer@1.4.5-lts.1
* supertest@6.3.3
