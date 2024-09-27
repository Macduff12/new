const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Отримати дані користувачів
app.get('/users', (req, res) => {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Помилка читання файлу');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Зберегти/оновити дані користувача
app.post('/users', (req, res) => {
  const newUser = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Помилка читання файлу');
      return;
    }

    let users = JSON.parse(data);
    const existingUserIndex = users.findIndex(user => user.name === newUser.name);

    if (existingUserIndex !== -1) {
      users[existingUserIndex] = newUser; // Оновлення існуючого користувача
    } else {
      users.push(newUser); // Додавання нового користувача
    }

    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Помилка запису файлу');
        return;
      }
      res.status(201).send('Дані користувача збережено');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
