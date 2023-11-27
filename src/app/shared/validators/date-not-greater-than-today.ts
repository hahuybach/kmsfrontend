import {AbstractControl, ValidationErrors} from "@angular/forms";

export function validateDateNotGreaterThanToday(control: AbstractControl): ValidationErrors | null {

  const selectedDate = control.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate && new Date(selectedDate) >= today) {
    return {'invalidDate': true};
  }

  return null;
}
