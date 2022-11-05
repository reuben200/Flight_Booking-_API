const express = require("express");
const { json } = require("express");
const flights = require("./controllers/flightController");
let models = require("./models/Flight");
const routes = require("./routes/flightRoute");
const fs = require("fs");
const { model } = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// 1. Book/Add a Flight
app.post('/flight', (req, res) => {
    const bookFlight = {
        id: req.body.id,
        title: req.body.title,
        time: req.body.time,
        price: 26000,
        date: req.body.date
    }
    models.push(bookFlight);
     res.json(models);
    const updatedBooking = JSON.stringify(models, null, 2);
    fs.writeFile(models, updatedBooking, (err)=>{
        if(err){
            return res.status(500).json({Message: "Internal Server Error"});
        };   
    })
        res.status(200).json({Message: `Flight wit id ${models.id} posted successfully!`})
    
});

// 2. This route gets all flights
app.get('/flight', (req, res) => res.json(models));

//3. This route gets single flight
app.get('/flight/:id', (req, res) => {
    // If statement to determine if a flight is available for that detsination
    const available = models.some(flight=>flight.id === req.params.id);
    if(available){
        res.json(models.filter(flight=>flight.id === req.params.id));  
    }else{ res.status(400).json(`There is no flight available for this destination with id ${req.params.id}`);    
    };    
});

// 4. Update/Edit Flight

    app.put('/flight/:id', (req, res) => {
  
    const available = models.some(flight=>flight.id === req.params.id);
    if(available){
        const updateFlight = req.body;

        flight.forEach(flight => {
            if (flight.id === req.params.id) {
                flight.time = updateFlight.time? updateFlight.time: flight.time;
                flight.price = updateFlight.price? updateFlight.price: flight.price;
                flight.date = updateFlight.date? updateFlight.date: flight.date;

                res.json({msg:'Flight was updated successfully', flight });
            };
            
        });  
    }else{ res.json(`No updates was made to fligth with id ${req.params.id}`);     
    };    
});

// 5. Delete Flight

app.delete('/flight/:id', (req, res)=>{
	const { id } = req.params;
	const deleted = models.find(flight => flight.id);
	if (deleted){
	models = models.filter(model => model.id !== id)
    res.status(200).json(`Entry id ${req.params.id} was deleted successfully`);
    }else{
    	res.status(404).json({message: "Flight entry you want to delete does not exist!"})
    }
});

app.use(json());
app.use("/", routes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
