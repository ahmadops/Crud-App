require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added for file paths
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

//MONGO_URI = "mongodb+srv://ahmadakram_db_user:1ypDccgeoqMFShbS@cluster0.3xghxsz.mongodb.net/"

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// --- API ROUTES ---
app.post('/users', async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Error: User already exists!" });
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.put('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Error: User does not exist!" });
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Error: User does not exist!" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

// --- SERVE FRONTEND ---
// This tells Express to serve the built React files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to handle React Router (if any)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//app.listen(5000, () => console.log("Server running on port 5000")); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
