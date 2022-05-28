const auth = require("../middleware/auth");
const {Customer, validate} = require("../models/customer");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
  customer = await customer.save();
  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    },{new: true});
    
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
});
  
router.delete('/:id', auth, async (req, res) => {
  
  try{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  }

  catch(ex){res.status(404).send('The customer with the given ID was not found.');}

    
});
  
router.get('/:id', async (req, res) => {
  try{
    const customer = await Customer.findById(req.params.id)
    res.send(customer);
  }
  catch(ex){
    res.status(404).send('The customer with the given ID was not found.');
  }
    
});

module.exports = router;