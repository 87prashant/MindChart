
#### `Trying to build something that could be used to visualize our thoughts more effectively while learning`
![Screenshot 2022-12-12 220503](https://user-images.githubusercontent.com/106697681/207102372-f4e16f2d-706f-448b-be37-d45bf3e9f531.png)

![Screenshot (18)](https://user-images.githubusercontent.com/106697681/207102393-f0061152-fffe-4624-9b72-cf864f9229aa.png)

[![notion (1)](https://user-images.githubusercontent.com/106697681/195251468-8c27de82-7eb0-4996-aaeb-f34b8749557d.png)](https://alike-stag-3a4.notion.site/Mind-Chart-97668ec9dbbe49cda72c19f0259a2870) 

[You can read more about it and give your suggestions here](https://alike-stag-3a4.notion.site/Mind-Chart-97668ec9dbbe49cda72c19f0259a2870)


This is a passion project. I am learning new technology by implementing it. Anyone is invited to contribute with the mindset of learning by doing


Any contribution is appreciated.

### Local Setup (Windows)
```
1. clone the repo
2. cd MindChart
3. yarn
4. create .env files from .env.local files (inside the 'root' directory and 'packages/client' directory)
5. Start the all 3 mongodb instances using "mongod --port 27017", "mongod --port 27027", and "mongod --port 27037". You can set up mongodb as described below if not already
6. cd packages/client
7. yarn start (To start the frontend server)
8. (In the new terminal) cd packages/server
9. yarn dev (To start the backend server)
```
#### Commands to Setup Mongodb
```
1. Install mongodb ( v6.0.3 ) and set up enviorment variables ( required for mongosh and mongod )
2. mongod --port 27017 --dbpath <path> --replSet mindChartReplicaSet
3. mongod --port 27027 --dbpath <path> --replSet mindChartReplicaSet
4. mongod --port 27037 --dbpath <path> --replSet mindChartReplicaSet
5. mongosh --port 27017
6. rs.initiate()
7. rs.add("localhost:27027")
8. rs.add("localhost:27037")
9. rs.status() ( to confirm )
```

I am using VS code, Powershell terminal, and yarn package manager

(Create an issue if these are not working for you)

##### Other
You have to set the Email and Password in the root `env` file to send emails

### Tech Stack
#### Frontend
1. React
2. TypeScript
3. EmotionJs
4. D3js
#### Backend
1. ExpressJs
2. MongoDB
3. Vercel for deployment (free)

