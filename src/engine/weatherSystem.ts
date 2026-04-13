import type { WeatherType } from '../types/index';

/** 根据季节随机生成天气 */
export function rollSeasonWeather(season: string): WeatherType {
  const pools: Record<string, WeatherType[]> = {
    春季: ['小雨', '小雨', '多云', '多云', '晴', '大雨', '大风'],
    夏季: ['高温', '高温', '高温', '大雨', '晴', '多云', '大雨'],
    秋季: ['晴', '晴', '多云', '多云', '大风', '小雨', '晴'],
    冬季: ['寒潮', '寒潮', '多云', '大风', '晴', '小雨', '寒潮'],
  };
  const pool = pools[season] || pools['秋季'];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** 天气对施工效率的倍率 */
export function getWeatherProgressModifier(weather: WeatherType): number {
  switch (weather) {
    case '晴':
      return 1.1;
    case '多云':
      return 1.0;
    case '小雨':
      return 0.85;
    case '大雨':
      return 0.6;
    case '高温':
      return 0.75;
    case '寒潮':
      return 0.7;
    case '大风':
      return 0.8;
    default:
      return 1.0;
  }
}

/** 天气对体力消耗的倍率 */
export function getWeatherStaminaModifier(weather: WeatherType): number {
  switch (weather) {
    case '晴':
      return 1.0;
    case '多云':
      return 1.0;
    case '小雨':
      return 1.1;
    case '大雨':
      return 1.3;
    case '高温':
      return 1.4;
    case '寒潮':
      return 1.3;
    case '大风':
      return 1.15;
    default:
      return 1.0;
  }
}

/** 天气的中文描述 + emoji */
export function weatherDescription(weather: WeatherType): string {
  switch (weather) {
    case '晴':
      return '☀️ 晴天，适合施工';
    case '多云':
      return '⛅ 多云，正常施工';
    case '小雨':
      return '🌧️ 小雨，部分作业受影响';
    case '大雨':
      return '⛈️ 大雨，室外作业暂停';
    case '高温':
      return '🔥 高温预警，注意防暑';
    case '寒潮':
      return '❄️ 寒潮来袭，混凝土养护困难';
    case '大风':
      return '💨 大风天气，高空作业暂停';
    default:
      return weather;
  }
}

/** 返回当前天气对行动的影响说明，用于事件描述中展示给玩家 */
export function weatherEffectNote(weather: WeatherType, isOutdoor: boolean, isWork: boolean): string | null {
  if (!isWork && !isOutdoor) return null;
  switch (weather) {
    case '晴':
      return isWork ? '【天气加成】晴天施工效率 +10%' : null;
    case '多云':
      return null;
    case '小雨':
      if (isOutdoor) return '【天气影响】小雨天气，施工效率 -15%，室外体力消耗 +10%';
      if (isWork) return '【天气影响】小雨天气，施工效率 -15%';
      return null;
    case '大雨':
      if (isOutdoor) return '【天气影响】暴雨天气，施工效率 -40%，室外体力消耗 +30%。虽说室外作业暂停，但赶工加班仍会强行推进';
      if (isWork) return '【天气影响】暴雨天气，施工效率 -40%';
      return null;
    case '高温':
      if (isOutdoor) return '【天气影响】高温预警，施工效率 -25%，室外体力消耗 +40%';
      if (isWork) return '【天气影响】高温预警，施工效率 -25%';
      return null;
    case '寒潮':
      if (isOutdoor) return '【天气影响】寒潮来袭，施工效率 -30%，室外体力消耗 +30%';
      if (isWork) return '【天气影响】寒潮来袭，施工效率 -30%';
      return null;
    case '大风':
      if (isOutdoor) return '【天气影响】大风天气，施工效率 -20%，室外体力消耗 +15%';
      if (isWork) return '【天气影响】大风天气，施工效率 -20%';
      return null;
    default:
      return null;
  }
}

/** 天气相关的随机事件描述（在季度总结中展示） */
export function weatherQuarterNote(weather: WeatherType): string | null {
  if (weather === '大雨') return '本季度连续暴雨，室外工程进度严重滞后，项目部已启动应急预案。';
  if (weather === '高温')
    return '高温橙色预警期间，项目部执行11:00-15:00停工令，工人在空调板房里刷手机等天凉。';
  if (weather === '寒潮') return '气温骤降，混凝土浇筑需额外保温养护，物资消耗增加。';
  if (weather === '大风') return '大风天气持续，塔吊停止作业，高空工人全部撤离。';
  return null;
}
