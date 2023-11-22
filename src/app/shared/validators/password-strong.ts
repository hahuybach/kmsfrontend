import {AbstractControl} from "@angular/forms";

export function passwordStrong(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.value;
  if (!password){
    return null
  }

  // Password should be at least 8 characters long
  if (password.length < 8) {
    return { weakPassword: true };
  }

  // Check if the password contains at least 1 number
  if (!password.match(/\d/)) {
    return { weakPassword: true };
  }

  // Check if the password contains at least 1 special character
  if (!password.match(/[!@#$%^&*(){}\[\]:;,.?<>~_+\-=|]/)) {
    return { weakPassword: true };
  }

  // Check if the password contains at least 1 uppercase letter
  if (!password.match(/[A-Z]/)) {
    return { weakPassword: true };
  }

  return null;
}
