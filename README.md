# 每日采集跑步分析数据到GoogleSheets自动化工具

## 动机：

[https://www.runningquotient.cn/](https://www.runningquotient.cn/) 是一个专业的跑步数据分析网站，提供的对跑者的"跑力"分析对我来说相当准确。
基本会员至多查詢42天內的跑力變化，更长时间（60，90，180）需要白金会员（RMB ¥60/月）才能看到， 故萌生了采集数据记录到表格自己统计到想法，配合Connect的详细统计数据，可以分析自己的跑步能力长期趋势。

同步佳明中国区运动数据到佳明国际区，Strava关联佳明国际区账号，进而实现strava跑步数据同步更新。

## 前置条件：

- runningquotient 已关联运动手表的账号
- 佳明手表 （如果仅采集跑力数据，其他能关联到rq的手表都行，华为/高驰/...）
- 二代跑步数据 (触地时间，步幅，垂直震幅，功率) 采集设备（Garmin RDP/HRM-PRO/HRM-RUN）
- Google Sheets（记录数据）/ Google Cloud Platform API (用于写入表格数据)

## 采集的数据：

- RQ：
  - '跑力更新时间', '训练负荷', '疲劳', '即时跑力', '跑力', '跑力说明', '趋势1', '趋势2',
- Garmin Connect
  - '活动id', '活动名称', '活动开始时间', '距离', '持续时间', '速度 m/s', '配速 min/km', '配速文字 min/km', '平均心率', '最大心率', '平均每分钟步频', '有氧效果', '
    无氧效果', '触地时间', '步幅', 'VO2Max', '垂直振幅', '垂直振幅比', '触地平衡', '训练效果', '训练负荷'

![rq](./assets/rq.png)
![connect](./assets/connect.png)
![sheet](./assets/sheet.png)

## 同步到佳明国际区，同步Strava

> 如有需要我可以单独弄一个仓库，只留下同步国区到国际区的功能 fork 后配置个人账号信息就能用
> 如有人正好有同样需求并看到这个repo可以email我，我再来弄这个仓库哈，折腾一晚上，睡觉了先～

![garmin_global](./assets/garmin_global.png)
![strava](./assets/strava.png)

## How to use

`yarn`

`yarn start`

Modify `src/index.ts`, then observe the running results in the console.
