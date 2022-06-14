import { JWT } from 'google-auth-library';
import { google } from 'googleapis';

import { GOOGLE_API_CLIENT_EMAIL_DEFAULT, GOOGLE_API_PRIVATE_KEY_DEFAULT, GOOGLE_SHEET_ID_DEFAULT } from '../constant';
import core from '@actions/core';
import _ from 'lodash';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID ?? GOOGLE_SHEET_ID_DEFAULT;
const GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL ?? GOOGLE_API_CLIENT_EMAIL_DEFAULT;
const GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY ?? GOOGLE_API_PRIVATE_KEY_DEFAULT;

export const insertDataToSheets = async (data) => {
    const client = new JWT({
        email: GOOGLE_API_CLIENT_EMAIL,
        key: GOOGLE_API_PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    // @ts-ignore
    const sheets = google.sheets({
        version: 'v4',
        auth: client,
    });

    try {
        const response2 = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: '工作表1!A1:AD',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    // ['导入时间', '跑力更新时间', '训练负荷', '疲劳', '即时跑力', '跑力', '跑力说明', '趋势1', '趋势2', '活动id', '活动名称', '活动开始时间', '距离', '持续时间', '速度 m/s', '配速 min/km', '配速文字 min/km', '平均心率', '最大心率', '平均每分钟步频', '有氧效果', '无氧效果', '触地时间', '步幅', 'VO2Max', '垂直振幅', '垂直振幅比', '触地平衡', '训练效果', '训练负荷'],
                    data,
                ],
            },
        });
        const posts2 = response2.data;
        console.log(posts2);
    } catch (e) {
        core.setFailed(e.message);
        throw new Error(e);
    }
};

/**
 * 获取最后一行的数据，用于比较是否相同
 */
export const getLatestSheetsData = async (): Promise<string[]> => {
    const client = new JWT({
        email: GOOGLE_API_CLIENT_EMAIL,
        key: GOOGLE_API_PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    // @ts-ignore
    const sheets = google.sheets({
        version: 'v4',
        auth: client,
    });

    try {
        const response2 = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: '工作表1!A1:AD',
        });
        const sheetsData = _.last(response2.data.values);
        return sheetsData;
        // console.log(response2.data);
        // console.log(sheetsData);
    } catch (e) {
        // core.setFailed(e.message);
        throw new Error(e);
    }
};

export const getLatestActivityIdInSheets = async () => {
    const data = await getLatestSheetsData();
    const id = data[9];
    console.log('LatestActivityIdInSheets: ', id);
    return id;
};
