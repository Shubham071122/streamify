import { formatDistanceToNow, parseISO } from 'date-fns';

export function getRelativeTime(dateString) {
  const date = parseISO(dateString);
  let formattedTime = formatDistanceToNow(date, { addSuffix: true });

  //Replace "hours" with "hr" ;
  formattedTime = formattedTime
    .replace(/ hours?/g,' hr')
    .replace(/ minutes?/g,' min')
    .replace(/ seconds?/g,' sec')

  return formattedTime;
}
