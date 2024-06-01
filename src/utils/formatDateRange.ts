export function formatItemsWithBrackets(dateArray: string[]) {
  return dateArray
    .map(date => `[ ${date.slice(2, 4)}.${date.slice(4, 6)}.${date.slice(6)} ]`)
    .join(' ');
}

export function formatItems(date: string) {
  return `${date.slice(2, 4)}.${date.slice(4, 6)}.${date.slice(6)}`;
}

export function formatDateString(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day}`;
}
