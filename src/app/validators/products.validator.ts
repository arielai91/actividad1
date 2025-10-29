import { AbstractControl, ValidationErrors } from '@angular/forms';

export function codigoProductoValidator(
  control: AbstractControl
): ValidationErrors | null {
  const regex = /^[A-Za-z]\d+$/;
  const valido = regex.test(control.value);
  return valido ? null : { codigoInvalido: true };
}

export function precioRangoValidator(
  control: AbstractControl
): ValidationErrors | null {
  const valor = control.value;
  if (valor < 10 || valor > 100) {
    return { fueraDeRango: true };
  }
  return null;
}

export function nombreMinimoValidator(
  control: AbstractControl
): ValidationErrors | null {
  const valor = control.value?.trim() || '';
  if (valor.length < 5) {
    return { nombreCorto: true };
  }
  return null;
}

export function costoValidoValidator(
  control: AbstractControl
): ValidationErrors | null {
  const valor = control.value;
  if (valor <= 0) {
    return { costoInvalido: true };
  }
  return null;
}
