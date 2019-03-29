# NPNRD WebApp
The web application is composed of two main components. The first is a Node.js application 
running expresss.js for the server. The second is a React.js application that
is the main client frontend. The application uses dev settings for local and
deployed keys.

## Production
The application is deployed on Heroku using it's CLI to enable changes to be pushed
to the host by changes in Git. The deployment needs two keys: MONGO_URI and SECURITY_KEY
to enable the process.ENV to have the required information.

### Database
The production database is hosted by mLab and is a MongoDB restored from a local 
copy of the database. The unique URI is loaded and used by the server for access
to the data.

## Development 
Development uses several types of files and services. To run in dev mode you can
execute `npm run dev` and it will run both the server and client.