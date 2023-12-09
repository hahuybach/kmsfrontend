import {TuiDay} from "@taiga-ui/cdk";

export function unSub(sub: any[]){
  if (sub){
    for (const subElement of sub) {
      subElement.unsubscribe()
    }
  }

}

export function dateToTuiDay(date: Date): TuiDay{
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return new TuiDay(year, month, day);
}
export function tuiDayToDate(date: TuiDay): Date{
  const day = date.day + 1;
  const month = date.month;
  const year = date.year;
  return new Date(year, month, day);
}
