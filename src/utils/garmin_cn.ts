const { GarminConnect } = require('@gooin/garmin-connect-cn');
const core = require('@actions/core');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const unzipper = require('unzipper');
export const downloadDir = './garmin_fit_files';

import { GARMIN_PASSWORD_DEFAULT, GARMIN_URL_DEFAULT, GARMIN_USERNAME_DEFAULT } from '../constant';

const GARMIN_USERNAME = process.env.GARMIN_USERNAME ?? GARMIN_USERNAME_DEFAULT;
const GARMIN_PASSWORD = process.env.GARMIN_PASSWORD ?? GARMIN_PASSWORD_DEFAULT;

export const getGarminStatistics = async () => {
    const GCClient = new GarminConnect();
// Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login(GARMIN_USERNAME, GARMIN_PASSWORD);
    const userInfo = await GCClient.getUserInfo();
    // console.log('userInfo', userInfo);

    // Get a list of default length with most recent activities
    const acts = await GCClient.getActivities(0, 10);
    // console.log('acts', acts);
    const recentRunningAct = _.filter(acts, { activityType: { typeKey: 'running' } })[0];
    // console.log('recentRunningAct', recentRunningAct);

    const {
        activityId, // 活动id
        activityName, // 活动名称
        startTimeLocal, // 活动开始时间
        distance, // 距离
        duration, // 时间
        averageSpeed, // 平均速度 m/s
        averageHR, // 平均心率
        maxHR, // 最大心率
        averageRunningCadenceInStepsPerMinute, // 平均每分钟步频
        aerobicTrainingEffect, // 有氧效果
        anaerobicTrainingEffect, // 无氧效果
        avgGroundContactTime, // 触地时间
        avgStrideLength, // 步幅
        vO2MaxValue, // VO2Max
        avgVerticalOscillation, // 垂直振幅
        avgVerticalRatio, // 垂直振幅比
        avgGroundContactBalance, // 触地平衡
        trainingEffectLabel, // 训练效果
        activityTrainingLoad, // 训练负荷
    } = recentRunningAct;

    const pace = 1 / (averageSpeed / 1000 * 60);
    const pace_min = Math.floor(1 / (averageSpeed / 1000 * 60));
    const pace_second = (pace - pace_min) * 60;
    // console.log('pace', pace);
    // console.log('pace_min', pace_min);
    // console.log('pace_second', pace_second);

    return {
        activityId, // 活动id
        activityName, // 活动名称
        startTimeLocal, // 活动开始时间
        distance, // 距离
        duration, // 持续时间
        // averageSpeed 是 m/s
        averageSpeed, // 速度
        averagePace: pace,  // min/km
        averagePaceText: `${pace_min}:${pace_second.toFixed(0)}`,  // min/km
        averageHR, // 平均心率
        maxHR, // 最大心率
        averageRunningCadenceInStepsPerMinute, // 平均每分钟步频
        aerobicTrainingEffect, // 有氧效果
        anaerobicTrainingEffect, // 无氧效果
        avgGroundContactTime, // 触地时间
        avgStrideLength, // 步幅
        vO2MaxValue, // 最大摄氧量
        avgVerticalOscillation, // 垂直振幅
        avgVerticalRatio, // 垂直振幅比
        avgGroundContactBalance, // 触地平衡
        trainingEffectLabel, // 训练效果
        activityTrainingLoad, // 训练负荷
        activityURL: GARMIN_URL_DEFAULT.ACTIVITY_URL + activityId, // 活动链接
    };
    // const detail = await GCClient.getActivity(recentRunningAct);
    // console.log('detail', detail);
};

/**
 * 下载 garmin 活动原始数据，并解压保存到本地
 * @param activityId
 */
export const downloadGarminActivity = async (activityId): Promise<string> => {
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }
    const GCClient = new GarminConnect();
// Uses credentials from garmin.config.json or uses supplied params
    await GCClient.login(GARMIN_USERNAME, GARMIN_PASSWORD);
    const userInfo = await GCClient.getUserInfo();
    // console.log('userInfo', userInfo);

// Use the id as a parameter
    const activity = await GCClient.getActivity({ activityId: activityId });
    await GCClient.downloadOriginalActivityData(activity, downloadDir);
    // console.log('userInfo', userInfo);
    const originZipFile = downloadDir + '/' + activityId + '.zip';
    await fs.createReadStream(originZipFile)
        .pipe(unzipper.Extract({ path: downloadDir }));
    const fitFilePath = `${downloadDir}/${activityId}_ACTIVITY.fit`;
    console.log('fitFilePath', fitFilePath);
    return fitFilePath;
};
