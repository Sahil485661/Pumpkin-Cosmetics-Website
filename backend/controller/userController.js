import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import crypto from "crypto";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

// register
export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new HandleError("Email already registered", 400));
    }
    
    // Handle avatar upload
    let avatarData = {
        public_id: "default_avatar",
        url: "https://res.cloudinary.com/demo/image/upload/default_avatar.png"
    };
    
    if (req.files && req.files.avatar) {
        try {
            const avatar = await uploadToCloudinary(req.files.avatar, 'pumpkin-cosmetics/avatars');
            avatarData = avatar;
        } catch (error) {
            return next(new HandleError("Error uploading avatar image", 500));
        }
    }
    
    // Create user (not verified yet)
    const user = await User.create({
        name,
        email,
        password,
        avatar: avatarData,
        isVerified: false
    });
    
    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    // If SKIP_EMAIL_VERIFICATION is enabled (development), mark user verified and sign in immediately
    if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        // Send token and sign the user in
        return sendToken(user, 201, res);
    }

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    const message = `Hi ${user.name},

Welcome to Pumpkin Cosmetics! 🎉

Please verify your email address to activate your account and start shopping.

Click the link below to verify your email:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

With love,
The Pumpkin Cosmetics Team
`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: "Verify Your Email - Pumpkin Cosmetics",
            message: message
        });
        
        res.status(201).json({
            success: true,
            message: `Verification email sent to ${user.email}. Please check your inbox.`,
            userId: user._id
        });
    } catch (error) {
        // If email fails, delete the user and return error
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(new HandleError("Error sending verification email. Please try again.", 500));
    }
})
// login
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("Please enter email and password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid Email or Password", 401))
    }
    
    // Check if email is verified
    if (!user.isVerified) {
        return next(new HandleError("Please verify your email before logging in. Check your inbox for the verification link.", 403))
    }
    
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
        return next(new HandleError("Invalid Email or Password", 401))
    }
    sendToken(user, 200, res);
})
// logout
export const logoutUser = handleAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged Out Successfully"
    })
})
// forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User not found", 404))
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return next(new HandleError("Error while generating reset token", 500))
    }
    const resetPasswordUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset/${resetToken}`;
    const message = `Hi ${user.name},

We received a request to reset your password for your Pumpkin Cosmetics account.  
No worries—we’ve got you covered!  

Click the link below to set up a new password:  

${resetPasswordUrl}  

For your security, this link will expire in 15 minutes.  
If you didn’t request a password reset, you can safely ignore this email—your account will remain secure.  

With love,  
The Pumpkin Cosmetics Team  
`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message: message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Error while sending email", 500))
    }
})

// Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new HandleError("Password reset token is invalid or has been expired", 400))
    }
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new HandleError("Password and Confirm Password do not match", 400))
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})
// GetUserDetails
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
})
// Update Password
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const checkPasswordMatch = await user.verifyPassword(oldPassword);
    if (!checkPasswordMatch) {
        return next(new HandleError("Old Password is incorrect", 400))
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("Password and Confirm Password do not match", 400))
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
})
// Upadating User Profle
export const updateProfile = handleAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    
    const updateUserDetails = {
        name,
        email
    };
    
    // Handle avatar upload if provided
    if (req.files && req.files.avatar) {
        const user = await User.findById(req.user.id);
        
        // Delete old avatar from Cloudinary if it exists and not default
        if (user.avatar && user.avatar.public_id && user.avatar.public_id !== 'default_avatar') {
            try {
                await deleteFromCloudinary(user.avatar.public_id);
            } catch (error) {
                console.log("Error deleting old avatar:", error.message);
            }
        }
        
        // Upload new avatar
        try {
            const avatar = await uploadToCloudinary(req.files.avatar, 'pumpkin-cosmetics/avatars');
            updateUserDetails.avatar = avatar;
        } catch (error) {
            return next(new HandleError("Error uploading new avatar", 500));
        }
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true,
    });
    
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user
    });
    
})
// Admin Get All User
export const getUserList = handleAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})
// Geting Single User 
export const getSingleUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError(`User id ${req.params.id} is not found`, 404))
    }
    res.status(200).json({
        success: true,
        user
    })
})
// Admin Changing USer role
export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;
    const userId = req.params.id; // ✅ admin will pass user id in URL

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new HandleError(`User with id ${userId} not found`, 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully by admin",
        user
    });
});

// Verify Email
export const verifyEmail = handleAsyncError(async (req, res, next) => {
    const { token } = req.params;
    
    if (!token) {
        return next(new HandleError("Invalid verification link", 400));
    }
    
    // Hash the token to match with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    // Find user with valid token
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() }
    });
    
    if (!user) {
        return next(new HandleError("Verification link is invalid or has expired", 400));
    }
    
    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Send success response and log user in
    sendToken(user, 200, res);
});

// Resend Verification Email
export const resendVerificationEmail = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return next(new HandleError("Please provide your email address", 400));
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
        return next(new HandleError("User not found with this email", 404));
    }
    
    if (user.isVerified) {
        return next(new HandleError("Email is already verified. You can login now.", 400));
    }
    
    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    
    const message = `Hi ${user.name},

Here's your new verification link for Pumpkin Cosmetics.

Click the link below to verify your email:

${verificationUrl}

This link will expire in 24 hours.

With love,
The Pumpkin Cosmetics Team
`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: "Verify Your Email - Pumpkin Cosmetics",
            message: message
        });
        
        res.status(200).json({
            success: true,
            message: `Verification email resent to ${user.email}`
        });
    } catch (error) {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(new HandleError("Error sending verification email. Please try again.", 500));
    }
});

// Admin Delete User 
export const deleteUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new HandleError("User not found", 404))
    }
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})