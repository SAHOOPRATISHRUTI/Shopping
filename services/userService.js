const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { isDuplicateEmail: true };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    return await User.create({ name, email, password: hashedPassword, role });
};



const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        return { isInvalidCredential: true }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { isInvalidCredential: true }
    }

    const token = jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return { token, role: user.role };
}

module.exports = {
    registerUser,
    loginUser
}