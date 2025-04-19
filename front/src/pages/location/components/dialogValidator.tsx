const validateForm = (name : string, type : string,
            description : string, hourlyRate : number,
            minimumTime : number, maximumTime : number) => {
    let isValid = true;
    const errors: string[] = [];
    const invalidFields: { [key: string]: boolean } = {};

    if (!name.trim()) {
        errors.push('Name is required');
        invalidFields.name = true;
        isValid = false;
    }

    if (!type.trim()) {
        errors.push('Type is required');
        invalidFields.type = true;
        isValid = false;
    }

    if (!description.trim()) {
        errors.push('Description is required');
        invalidFields.description = true;
        isValid = false;
    }

    if (hourlyRate <= 0) {
        errors.push('Hourly rate must be greater than 0');
        invalidFields.hourlyRate = true;
        isValid = false;
    }

    if (minimumTime <= 0) {
        errors.push('Minimum time must be greater than 0');
        invalidFields.minimumTime = true;
        isValid = false;
    }

    if (maximumTime <= 0) {
        errors.push('Maximum time must be greater than 0');
        invalidFields.maximumTime = true;
        isValid = false;
    }
    
    if (minimumTime > maximumTime) {
        errors.push('Minimum time cannot be greater than maximum time');
        invalidFields.minimumTime = true;
        invalidFields.maximumTime = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
};

export default validateForm;