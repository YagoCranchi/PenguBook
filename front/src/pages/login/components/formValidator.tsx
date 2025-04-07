const validateForm = (name: string, password: string) => {
    let isValid = true;
    const errors: string[] = [];
    const invalidFields: { [key: string]: boolean } = {};

    if (!name.trim()) {
        errors.push('Name is required');
        invalidFields.name = true;
        isValid = false;
    }

    var minCaractersPassword = 3;
    if (password.length < minCaractersPassword) {
        errors.push('Password must be at least ' + minCaractersPassword + ' characters');
        invalidFields.password = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
};

export default validateForm;