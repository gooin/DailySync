import { BARK_KEY_DEFAULT } from './constant';
import { syncGarminCN2GarminGlobal } from './utils/garmin_cn';

const axios = require('axios');
const core = require('@actions/core');
const BARK_KEY = process.env.BARK_KEY ?? BARK_KEY_DEFAULT;



try {
    syncGarminCN2GarminGlobal()
    // downloadGarminActivity('190727967').then(res => {
    //     console.log(res);
    //     uploadGarminActivity(res);
    // });
    // uploadGarminActivity('./garmin_fit_files/191409924_ACTIVITY.fit');

} catch (e) {
    axios.get(
        `https://api.day.app/${BARK_KEY}/Garmin CN -> Garmin Global 同步数据运行失败了，快去检查！/${e.message}`);
    core.setFailed(e.message);
    throw new Error(e);
}




