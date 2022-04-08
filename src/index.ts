import app from './app';
import { APP_PORT, APP_HOST } from './constants';

app.listen(APP_PORT, () => {
  console.log(
    `🚀 Server ready at: http://${APP_HOST}:${APP_PORT}`,
  );
});
