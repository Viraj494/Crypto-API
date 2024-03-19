const express = require('express');
const Fav = require("../models/currencyModel")

const router = express.Router();


  // Create a new favourite
  router.post('/add', async (req, res) => {
    const { name } = req.body;
  
    try {

      const fav = new Fav({ name });
      await fav.save();
      res.send(fav);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });


//get all Favourites
router.get('/all', async (req, res) => {
    try {
      const favourites = await Fav.find({});
      res.send(favourites);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });


  // Delete an favourite
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const fav = await Fav.findByIdAndDelete(id);
    res.send(fav);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
