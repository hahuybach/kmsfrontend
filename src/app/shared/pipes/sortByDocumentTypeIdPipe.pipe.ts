import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortById',
  pure: false,
})
export class SortByIdPipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    array.sort((a, b) => {
      return a.documentType.documentTypeId - b.documentType.documentTypeId;
    });

    return array;
  }
}
