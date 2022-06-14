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
} from '../constant';
import axios from 'axios';
const RQ_USERID = process.env.RQ_USERID ?? RQ_USERID_DEFAULT;
const RQ_COOKIE = process.env.RQ_COOKIE ?? RQ_COOKIE_DEFAULT;
const RQ_CSRF_TOKEN = process.env.RQ_CSRF_TOKEN ?? RQ_CSRF_TOKEN_DEFAULT;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID ?? GOOGLE_SHEET_ID_DEFAULT;
const GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL ?? GOOGLE_API_CLIENT_EMAIL_DEFAULT;
const GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY ?? GOOGLE_API_PRIVATE_KEY_DEFAULT;
const BARK_KEY = process.env.BARK_KEY ?? BARK_KEY_DEFAULT;
const GARMIN_USERNAME = process.env.GARMIN_USERNAME ?? GARMIN_USERNAME_DEFAULT;
const GARMIN_PASSWORD = process.env.GARMIN_PASSWORD ?? GARMIN_PASSWORD_DEFAULT;


export async function getRQOverView() {
    const url = `${RQ_HOST_DEFAULT}${RQ_ROUTES_DEFAULT.UPDATE}${RQ_USERID}`;

    console.log('url', url);
    try {
        const res = await axios(url, {
            method: 'post',
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7,la;q=0.6,ja;q=0.5',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': RQ_CSRF_TOKEN,
                'x-requested-with': 'XMLHttpRequest',
                'cookie': RQ_COOKIE,
                'Referer': 'https://www.runningquotient.cn/training/overview',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
        });

        // console.log('getOverView ', res);
        if (res?.data?.data) {
            const rqdata = rqRegexp(res?.data?.data);
            return rqdata;
        } else {
            console.error('ERROR at 0, 检查TOKEN');
            await axios.get(
                `https://api.day.app/${BARK_KEY}/RQ运行失败了/ERROR检查TOKEN`);
            return {};
        }
    } catch (e) {
        console.error('ERROR, 检查TOKEN');
        await axios.get(
            `https://api.day.app/${BARK_KEY}/RQ运行失败了/${e.message}`);
        throw new Error(e);
    }

}

export const rqRegexp = (htmlData) => {
    const { conditionHtml, heartHtml, paceHtml, recordHtml, runlevelHtml } = htmlData;
    // console.log({ resJSON });
    // console.log({ recordHtml });
    const now = /<div class.*data-bit[^>]*>(.*?)<small>/.exec(recordHtml.substr(0, 3000)) as RegExpExecArray;
    const load = /<div class.*data-text[^>]*>(.*?)<small>点/.exec(recordHtml.substr(0, 3000)) as RegExpExecArray;
    const time = /<span class.*data-label[^>]*>(.*?)<\/span>/.exec(recordHtml.substr(0, 3000)) as RegExpExecArray;

    // console.log({ time });
    console.log('即时跑力', Number(now[1]));
    console.log('训练负荷', Number(load[1]));
    console.log('跑力更新时间', time[1]);

    const tired = /<b[^>]*>(.*?)<\/b>/.exec(conditionHtml) as RegExpExecArray;
    console.log('疲劳', tired[1]);

    const runLevel = /<span class.*myrunlevel[^>]*>(.*?)<\/span>/.exec(runlevelHtml) as RegExpExecArray;
    const up = /<font [^>]*>(.*?)<\/font>/.exec(runlevelHtml) as RegExpExecArray;
    const upValue = /<\/font[^>]*>(.*?)<\/small>/.exec(runlevelHtml) as RegExpExecArray;
    const runLevelDesc = /<div class.*col-xs-12 [^>]*>(.*?)<\/div>/.exec(runlevelHtml) as RegExpExecArray;
    console.log('跑力', runLevel[1]);
    console.log('跑力说明', runLevelDesc[1]);
    console.log('趋势', up[1]);
    console.log('趋势', upValue[1]);

    const result = {
        updateAt: Date.now(),
        rqTime: time[1],
        rqLoad: load[1],
        rqTired: tired[1],
        rqRunLevelNow: now[1],
        rqRunLevel: runLevel[1],
        runLevelDesc: runLevelDesc[1],
        rqTrend1: up[1],
        rqTrend2: upValue[1],
    };
    return result;
};
