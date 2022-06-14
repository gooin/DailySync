const strava = require('strava-v3');
import {
    STRAVA_ACCESS_TOKEN_DEFAULT,
    STRAVA_CLIENT_ID_DEFAULT,
    STRAVA_CLIENT_SECRET_DEFAULT,
    STRAVA_REDIRECT_URI_DEFAULT,
} from '../constant';

/**
 *
 *  strava关联佳明国际区账号后可以由佳明国际区同步到strava，此方法暂时废弃
 *
 */


const STRAVA_ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN ?? STRAVA_ACCESS_TOKEN_DEFAULT;
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID ?? STRAVA_CLIENT_ID_DEFAULT;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET ?? STRAVA_CLIENT_SECRET_DEFAULT;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI ?? STRAVA_REDIRECT_URI_DEFAULT;

strava.config({
    'access_token': STRAVA_ACCESS_TOKEN,
    'client_id': STRAVA_CLIENT_ID,
    'client_secret': STRAVA_CLIENT_SECRET,
    'redirect_uri': STRAVA_REDIRECT_URI,
});

export const getStravaUserInfo = async () => {
    console.log('STRAVA_ACCESS_TOKEN',STRAVA_ACCESS_TOKEN);

    const payload = await strava.athlete.get({});
    console.log(payload);
};
