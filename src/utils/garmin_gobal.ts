import {
    GARMIN_USERNAME_DEFAULT,
    GARMIN_PASSWORD_DEFAULT, GARMIN_GLOBAL_USERNAME_DEFAULT, GARMIN_GLOBAL_PASSWORD_DEFAULT,

} from '../constant';
import fs from 'fs';
import { downloadDir } from './garmin_cn';

const { GarminConnect } = require('garmin-connect');

const GARMIN_GLOBAL_USERNAME = process.env.GARMIN_GLOBAL_USERNAME ?? GARMIN_GLOBAL_USERNAME_DEFAULT;
const GARMIN_GLOBAL_PASSWORD = process.env.GARMIN_GLOBAL_PASSWORD ?? GARMIN_GLOBAL_PASSWORD_DEFAULT;

/**
 *  // TODO garmin-connect 上传功能无了，等会给提交pr，可以导入数据
 * 上传 .fit file 到 garmin 国际区
 * @param fitFilePath
 */
export const uploadGarminActivity = async (fitFilePath: string): Promise<void> => {
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }
    const GCClient = new GarminConnect();
// Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login(GARMIN_GLOBAL_USERNAME, GARMIN_GLOBAL_PASSWORD);
    const userInfo = await GCClient.getUserInfo();
    console.log('userInfo', userInfo);
    const upload = await GCClient.uploadActivity(fitFilePath);
    const activityId = upload.detailedImportResult.successes[0].internalId;
    console.log('upload to garmin global activityId', activityId);
};
