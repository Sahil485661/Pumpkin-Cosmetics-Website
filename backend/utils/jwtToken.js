export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const days = Number(process.env.EXPIRE_COOKIE) || 7; // default to 7 days
    const options = {
        expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    // Set SameSite and secure flags appropriately
    options.sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
    options.secure = process.env.NODE_ENV === 'production';

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};