const { User } = require("../models/index");

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.create({
      email,
      password,
    });

    res.status(201).json({ message: "User registered.", user_id: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validPassord = await bcrypt.compare(password, user.password);

    if (!validPassord) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(200).json({ message: "Login successful.", user_id: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
