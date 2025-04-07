import { cpfValidator } from "../../../utils/cpf";

const validateForm = (name: string, email: string,
    cpf: string, phone: string,
    password: string, passwordConfirm: string) => {
    let isValid = true;
    const errors: string[] = [];
    const invalidFields: { [key: string]: boolean } = {};

    if (!name.trim()) {
        errors.push('Name is required');
        invalidFields.name = true;
        isValid = false;
    }

    if (!email.includes('@')) {
        errors.push('Invalid email address');
        invalidFields.email = true;
        isValid = false;
    }

    if (!cpfValidator(cpf)) {
        errors.push('Invalid CPF');
        invalidFields.cpf = true;
        isValid = false;
    }

    if (phone.length < 10) {
        errors.push('Invalid phone number');
        invalidFields.phone = true;
        isValid = false;
    }

    var minCaractersPassword = 3;
    if (password.length < minCaractersPassword) {
        errors.push('Password must be at least ' + minCaractersPassword + ' characters');
        invalidFields.password = true;
        isValid = false;
    }

    if (password !== passwordConfirm) {
        errors.push('Passwords do not match');
        invalidFields.passwordConfirm = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
};

export default validateForm;