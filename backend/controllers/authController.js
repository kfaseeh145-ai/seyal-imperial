const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user & trigger OTP email
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;



  const userExists = await User.findOne({ email });

  // If user exists but isn't verified, let them try registering again by overwriting
  if (userExists && userExists.isVerified) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate 6-digit OTP
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // If they exist but aren't verified, update them. Else create new.
  let user;
  if (userExists) {
    userExists.name = name;
    userExists.password = password; // Pre-save hook will hash it again if modified
    userExists.verificationCode = verificationCode;
    user = await userExists.save();
  } else {
    user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationCode
    });
  }

  if (user) {
    // Send email via Nodemailer Architecture
    await sendEmail({
      to: user.email,
      subject: 'Seyal Imperial - Your Access Code',
      text: `Welcome to the Royal Collection.\n\nYour secure verification code is: ${verificationCode}\n\nEnter this code on the website to activate your empire.`,
      html: `
        <div style="font-family: serif; color: #111; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; text-align: center;">
          <h1 style="color: #c9a96e; text-transform: uppercase; letter-spacing: 2px;">Seyal Imperial</h1>
          <p>Welcome to the Royal Collection.</p>
          <div style="background: #000; color: #fff; font-size: 24px; padding: 15px; letter-spacing: 5px; margin: 30px 0;">
            ${verificationCode}
          </div>
          <p>Enter this master code into the interface to permanently bond your account.</p>
        </div>
      `
    });

    res.status(200).json({
      message: 'Verification Code Sent',
      email: user.email,
      isVerified: false
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify OTP and issue real JWT token
// @route   POST /api/auth/verify
// @access  Public
const verifyUser = asyncHandler(async (req, res) => {
  const { email, code } = req.body;



  const user = await User.findOne({ email });

  if (user && user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = undefined; // Wipe code for security
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid or expired access code');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;



  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Ensure they are verified before allowing login
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Account unverified. Please register again to get a new code.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
};
