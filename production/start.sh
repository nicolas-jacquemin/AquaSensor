#!/bin/sh

echo "WELCOME TO Aquasensor PRODUCTION ENVIRONMENT"
echo "Starting server..."

service nginx start
mongod --fork --logpath /var/log/mongodb/mongod.log
redis-server --daemonize yes

#Run server
cd server
npm install --omit=dev > /dev/null
npm run start