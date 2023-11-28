export function unSub(sub: any[]){
  if (sub){
    for (const subElement of sub) {
      subElement.unsubscribe()
    }
  }

}
