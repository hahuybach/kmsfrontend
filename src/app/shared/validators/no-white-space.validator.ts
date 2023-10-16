import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NowhiteSpaceValidator(control: AbstractControl) {
  const { value: controlVal } = control;
  const isWhiteSpaceOnly = (controlVal || '').trim().length === 0;
  return isWhiteSpaceOnly ? { whitespace: 'Value is only whitespace' } : null;
}
