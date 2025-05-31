import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return new Date(text) > new Date();
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Data inválida! Não é possivel agendar para o passado.';
  }
}
