import {
    GARMIN_USERNAME_DEFAULT,
    GARMIN_PASSWORD_DEFAULT, GARMIN_GLOBAL_USERNAME_DEFAULT, GARMIN_GLOBAL_PASSWORD_DEFAULT,

} from '../constant';
import fs from 'fs';
import { downloadDir } from './garmin_cn';

const { GarminConnect } = require('@gooin/garmin-connect');

const GARMIN_GLOBAL_USERNAME = process.env.GARMIN_GLOBAL_USERNAME ?? GARMIN_GLOBAL_USERNAME_DEFAULT;
const GARMIN_GLOBAL_PASSWORD = process.env.GARMIN_GLOBAL_PASSWORD ?? GARMIN_GLOBAL_PASSWORD_DEFAULT;

/**
 *  // fix: 上传功能以修正，但会报个异常，不用管可以上传上去的。
 * 上传 .fit file 到 garmin 国际区
 * @param fitFilePath
 * @param client
 */
export const uploadGarminActivity = async (fitFilePath: string, client = null): Promise<void> => {
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }
    let GCClient = client ?? new GarminConnect();
    if (!client) {
        await GCClient.login(GARMIN_GLOBAL_USERNAME, GARMIN_GLOBAL_PASSWORD);
        const userInfo = await GCClient.getUserInfo();
        // console.log('userInfo', userInfo);
    }
// Uses credentials from garmin.config.json or uses supplied params



    const upload = await GCClient.uploadActivity(fitFilePath);
    // const activityId = upload.detailedImportResult.successes[0].internalId;
    console.log('upload to garmin global activity', upload);
    // console.log('upload to garmin global activityId', activityId);
};

export const getGaminGlobalClient = async ()=>{
    const GCClient = new GarminConnect();
// Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login(GARMIN_GLOBAL_USERNAME, GARMIN_GLOBAL_PASSWORD);
    const userInfo = await GCClient.getUserInfo();
    console.log('userInfo global', userInfo);
    return GCClient;
}
