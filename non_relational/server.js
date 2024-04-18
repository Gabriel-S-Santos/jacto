const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require("./car-non-relational-firebase-adminsdk-7tjzc-6c39c72629.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://car-non-relational-default-rtdb.firebaseio.com"
});


const db = admin.database();
const carsRef = db.ref('cars');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/cars', async (req, res) => {
  try {
    const snapshot = await carsRef.once('value');
    const cars = snapshot.val();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/cars', async (req, res) => {
  const { brand, model, year } = req.body;
  try {
    const newCarRef = carsRef.push();
    await newCarRef.set({ brand, model, year });
    res.status(201).json({ id: newCarRef.key });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { brand, model, year } = req.body;
  try {
    await carsRef.child(id).update({ brand, model, year });
    res.json({ id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await carsRef.child(id).remove();
    res.json({ message: 'Carro deletado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});


