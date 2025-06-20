const express = require('express');
const router = express.Router();

// Sample mock data (can be moved to a JSON file or controller)
const newBooks = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear' },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
];

const mostReadBooks = [
  { id: 3, title: '1984', author: 'George Orwell' },
  { id: 4, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
];

const events = [
  { id: 1, title: 'Book Fair 2025', date: '2025-06-30' },
  { id: 2, title: 'Library Orientation', date: '2025-07-01' },
];

// Routes
router.get('/home/new-books', (req, res) => res.json(newBooks));
router.get('/home/most-read', (req, res) => res.json(mostReadBooks));
router.get('/home/events', (req, res) => res.json(events));

module.exports = router;
