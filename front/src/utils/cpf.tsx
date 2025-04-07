const cpfValidator = (cpf: String) => {
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1+$/.test(cleanCpf)) {
        return false;
    }

    const validateDigit = (cpf: string, factor: number) => {
        let total = 0;
        for (let i = 0; i < factor - 1; i++) {
            total += parseInt(cpf[i]) * (factor - i);
        }
        const remainder = (total * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };

    const firstDigit = validateDigit(cleanCpf, 10);
    const secondDigit = validateDigit(cleanCpf, 11);

    if (firstDigit !== parseInt(cleanCpf[9]) || secondDigit !== parseInt(cleanCpf[10])) {
        return false;
    }

    return true;
};

const cpfFormatter = (cpf: string) => {
    return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
}

export { cpfValidator, cpfFormatter };