import ScheduleInterval from './ScheduleInterval'

export type Day = 1 | 2 | 3 | 4 | 5;
export type Hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Schedule = {
  [key in `d${ Day }`]: {
    [key in `h${ Hour }`]: ScheduleInterval
  }
};

export default Schedule
