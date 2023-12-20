import { TuiDay } from '@taiga-ui/cdk';

export function unSub(sub: any[]) {
  if (sub) {
    for (const subElement of sub) {
      subElement.unsubscribe();
    }
  }
}

export function dateToTuiDay(date: Date): TuiDay {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return new TuiDay(year, month, day);
}

export function dateToTuiDayU(date: Date | undefined): TuiDay {
  const validDate = date ?? new Date();

  const day = validDate.getDate();
  const month = validDate.getMonth();
  const year = validDate.getFullYear();

  return new TuiDay(year, month, day);
}

export function tuiDayToDate(date: TuiDay): Date {
  const day = date.day + 1;
  const month = date.month;
  const year = date.year;
  return new Date(year, month, day);
}
export function tuiDayCalendarToDate(date: TuiDay): Date {
  const day = date.day;
  const month = date.month;
  const year = date.year;
  return new Date(year, month, day);
}
export function getFirstAndLastName(fullName: any): string {
  if (fullName) {
    const nameArray: string[] = fullName.split(' ');
    if (nameArray.length <= 1) {
      return nameArray[0];
    }
    const firstName = nameArray[0];
    const lastName = nameArray[nameArray.length - 1];

    return firstName.concat(' ', lastName);
  }
  return '';
}
export function toIsoString(string: any) {
  let date = new Date(string);
  date.setDate(date.getDate() + 1);
  return date.toISOString();
}

export function toIsoStringUrl(string: any) {
  console.log(string);
  if (string) {
    return new Date(string).toISOString();
  }
  return null;
}
export function tuiDayToDateNull(date: TuiDay | null | undefined): Date | null {
  if (!date) {
    return null; // Return null if date is null or undefined
  }

  const day = date.day + 1;
  const month = date.month;
  const year = date.year;
  return new Date(year, month, day);
}
