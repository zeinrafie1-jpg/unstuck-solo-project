const bcrypt = require('bcryptjs');     // library for hashing/comparing passwords
const jwt = require('jsonwebtoken');    // library for creating/verifying JWTs (login "proof")
const User = require('../models/User'); // the User model, so we can create/find users in MongoDB

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // req.body is the JSON data sent by whoever called this route (e.g. your curl command).
    // We pull out just the fields we need.

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash the plain-text password before storing it — NEVER store real passwords directly.
    //   - "password" is the plain text (e.g. "password123")
    //   - "10" is the SALT ROUNDS — how many times bcrypt scrambles the password internally. 10 is standard, but you can increase it for more security (at the cost of speed).

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the actual user record in MongoDB using the User model.
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create a JWT (JSON Web Token) — this is essentially a signed, tamper-proof "ID card"
    // that proves "this request belongs to user X" on future requests, without needing
    // to send the email/password again every time.
    // { userId: user._id } — the actual data embedded inside the token (just the user's unique ID)
    // process.env.JWT_SECRET — a secret string only your server knows; used to "sign" the token
    // so it can't be forged or tampered with by anyone who doesn't have this secret
    // { expiresIn: '7d' } — the token automatically becomes invalid after 7 days
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send the token back to the browser as an HTTP-only cookie.
    // "HTTP-only" means JavaScript in the browser CANNOT read this cookie (protects against
    // certain attacks like XSS stealing the token) — but the browser will automatically
    // include it on future requests to your server, so the user stays "logged in."
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: { id: existingUser._id, name: existingUser.name, email: existingUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { signup, login, logout, getMe };
