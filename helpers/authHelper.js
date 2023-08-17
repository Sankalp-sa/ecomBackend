import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    }
    catch (err) {
        console.log(err);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
    catch (err) {
        console.log(err);
    }
}

