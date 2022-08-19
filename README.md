## Notification Preference Center
The notification center, is an API you can use as a micro-service in order to store notification consents provided by your users

### Running the project with Docker
To run the project with Docker, simply run:

```
docker-compose up
```

This will start a MySQL and the App containers, migrate the database and start the server. The app will be available at [http://localhost:3000](http://localhost:3000)

### Running without Docker
To start the project without docker you need to do the following:

- Install the project's dependencies with `yarn`
- Specify a database URL in the proper format, for example `mysql://root:qwerty1@localhost:3306/notifications`
- Use the database URL and start the server
```
DATABASE_URL=<database URL> nodemon src/index.ts
```

### Developing
The development version uses [`nodemon`](https://www.npmjs.com/package/nodemon) which means that whenever you save a file, the application server will restart

### Running the tests
If you're using Docker, you can just enter the container by running 
```
docker exec -it notifiations_center_app  /bin/sh
```
then inside the container, run
```
yarn test
```

If you're not Docker, you need to specify the URL for the test database, for example `mysql://root:qwerty1@localhost:3306/notifications_test_db` then run

```
APP_PORT=4000 DATABASE_URL=<test database URL> && yarn run prisma migrate reset --force && jest --bail --verbose
```

### Documentation
The API's documentation can be found on the following URL: https://www.falexandrou.com/notification-preference-center/

### Reporting issues / Pull Request
Reporting issues and submit a pull requests is more than welcome. Please feel free to contribute
