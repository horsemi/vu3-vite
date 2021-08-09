/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm';
const DATE_FORMAT = 'YYYY/MM/DD ';

export function formatToDateTime(
  date: moment.MomentInput = null,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = null, format = DATE_FORMAT): string {
  return moment(date).format(format);
}

export function getBeginTime(date: moment.MomentInput = null, format = DATE_TIME_FORMAT) {
  return moment(date).startOf('days').format(format);
}

export function getEndTime(date: moment.MomentInput = null, format = DATE_TIME_FORMAT) {
  return moment(date).endOf('days').format(format);
}

export const dateUtil = moment;
