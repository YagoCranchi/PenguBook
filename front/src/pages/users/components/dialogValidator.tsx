import { cpfValidator } from "../../../utils/cpf";

const validateForm = (name: string, email: string, phone: string, cpf: string) => {
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

    if (phone.length < 10) {
        errors.push('Invalid phone number');
        invalidFields.phone = true;
        isValid = false;
    }

    if (!cpfValidator(cpf)) {
        errors.push('Invalid CPF');
        invalidFields.cpf = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
};

export default validateForm;