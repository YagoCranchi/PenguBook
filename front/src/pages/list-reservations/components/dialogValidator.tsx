const validateForm = (
    userId: string,
    locationId: string,
    startDate: string,
    endDate: string,
    status: string
) => {
    let isValid = true;
    const errors: string[] = [];
    const invalidFields: { [key: string]: boolean } = {};

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!userId) {
        errors.push('Select a valid user');
        invalidFields.userId = true;
        isValid = false;
    }

    if (!locationId) {
        errors.push('Select a valid location');
        invalidFields.locationId = true;
        isValid = false;
    }

    if (!startDate) {
        errors.push('Start date is required');
        invalidFields.startDate = true;
        isValid = false;
    }

    if (!endDate) {
        errors.push('End date is required');
        invalidFields.endDate = true;
        isValid = false;
    } else if (start >= end) {
        errors.push('End date must be after start date');
        invalidFields.endDate = true;
        isValid = false;
    }

    if (!status) {
        errors.push('Status is required');
        invalidFields.status = true;
        isValid = false;
    }

    return { isValid, errors, invalidFields };
}

export default validateForm;