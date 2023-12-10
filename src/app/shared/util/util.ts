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
  const day = date.day;
  const month = date.month;
  const year = date.year;
  return new Date(year, month, day);
}
export function toIsoString(string: any){
  let date = new Date(string);
  date.setDate(date.getDate() + 1)
  return date.toISOString()

}

export function toIsoStringUrl(string: any){
  console.log(string);
  if (string){
    return new Date(string).toISOString()
  }
  return null
}
