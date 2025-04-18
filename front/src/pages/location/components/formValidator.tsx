const validateForm = (name: string) => {
    let isValid = true;
    const errors: string[] = [];
    const invalidFields: { [key: string]: boolean } = {};

    if (!name.trim()) {
        errors.push('Name is required');
        invalidFields.name = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
};

export default validateForm;