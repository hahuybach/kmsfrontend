export function unSub(sub: any[]){
  for (const subElement of sub) {
    subElement.unsubscribe()
  }
}
