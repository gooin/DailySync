import {
    RQ_USERID_DEFAULT,
    RQ_CSRF_TOKEN_DEFAULT,
    RQ_COOKIE_DEFAULT,
    RQ_HOST_DEFAULT,
    RQ_ROUTES_DEFAULT,
    GOOGLE_API_PRIVATE_KEY_DEFAULT,
    GOOGLE_SHEET_ID_DEFAULT,
    GOOGLE_API_CLIENT_EMAIL_DEFAULT,
    BARK_KEY_DEFAULT,
    GARMIN_USERNAME_DEFAULT,
    GARMIN_PASSWORD_DEFAULT, GARMIN_URL_DEFAULT, UA_DEFAULT,
    STRAVA_ACCESS_TOKEN_DEFAULT,
    STRAVA_CLIENT_ID_DEFAULT,
    STRAVA_CLIENT_SECRET_DEFAULT,
    STRAVA_REDIRECT_URI_DEFAULT,
} from './constant';
import { getStravaUserInfo } from './utils/strava';
import { getLatestActivityIdInSheets, getLatestSheetsData, insertDataToSheets } from './utils/google_sheets';
import { downloadGarminActivity, getGarminStatistics } from './utils/garmin_cn';
import { getRQOverView } from './utils/runningquotient';
import { uploadGarminActivity } from './utils/garmin_gobal';

const axios = require('axios');
const qs = require('qs');
const core = require('@actions/core');
const FormData = require('form-data');
const _ = require('lodash');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const { GarminConnect } = require('@gooin/garmin-connect-cn');

const BARK_KEY = process.env.BARK_KEY ?? BARK_KEY_DEFAULT;

export const run = async () => {
    const rqResult = await getRQOverView();
    const garminStatistics = await getGarminStatistics();
    const activityId = garminStatistics.activityId;
    // console.log('garminStatistics', garminStatistics);
    const data = _.assign(rqResult, garminStatistics);
    console.log('update all data', data);
    const finalResult = _.values(data);
    const latestActivityIdInSheets = await getLatestActivityIdInSheets();
    if (_.isEqual(latestActivityIdInSheets, activityId)) {
        console.log('=== 没有需要更新的数据！，快去跑步！===');
    } else {
        // console.log('finalResult', finalResult);
        await insertDataToSheets(finalResult);
        // 下载佳明原始数据
        const filePath = await downloadGarminActivity(activityId);
        // 上传到佳明国际区
        await uploadGarminActivity(filePath);

    }

};

try {
    run();
    // getStravaUserInfo();
    // getLatestActivityIdInSheets();
    // downloadGarminActivity('190727967').then(res => {
    //     console.log(res);
    //     uploadGarminActivity(res);
    // });
    // uploadGarminActivity('./garmin_fit_files/191409924_ACTIVITY.fit');

} catch (e) {
    axios.get(
        `https://api.day.app/${BARK_KEY}/同步数据运行失败了，快去检查！/${e.message}`);
    core.setFailed(e.message);
    throw new Error(e);
}




