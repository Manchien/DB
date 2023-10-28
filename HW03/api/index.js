const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Int32 } = require("mongodb");
const ObjectId = mongoose.Types.ObjectId;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/hotelroomsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const roomSchema = new mongoose.Schema({
  Room_ID: Number,
  Hotel_ID: Number,
  Room_type: String,
  Price: Number,
  Status: String,
});

const roomModel = mongoose.model("Room", roomSchema);

// Create a new Room
app.post("/createRoom", (req, res) => {
  const roomData = req.body;
  roomModel.create(roomData)
    .then((newRoom) => {
      console.log("Room Created with ID: " + newRoom._id);
      res.status(200).send("Room created successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error creating Room");
    });
  });


app.get("/Rooms", (req, res) => {
  roomModel.find({})
    .then((Rooms) => {
      res.send(Rooms);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching Rooms");
    });
});

// Update a Room by ID
app.put("/updateRoom/:id", (req, res) => {
  const id = req.params.id;
  const updatedroomData = req.body;

  roomModel.findByIdAndUpdate(id, updatedroomData, { new: true })
    .then((updatedRoom) => {
      if (!updatedRoom) {
        return res.status(404).send("Room not found");
      }
      res.send(updatedRoom);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating Room");
    });
});


app.delete("/deleteRoom/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const isValidObjectId = ObjectId.isValid(id);

    if (!isValidObjectId) {
      return res.status(400).send("Invalid Room ID");
    }

    const result = await roomModel.findByIdAndRemove(id);
    if (!result) {
      res.status(404).send("Room not found");
    } else {
      res.status(200).send("Room deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting Room");
  }
});

// searching Rooms by type
app.get("/searchRoomsByName", (req, res) => {
  const searchName = req.query.name; // Get the name to search for from query parameters
  roomModel.find({Room_type: { $regex: searchName, $options: "i" } }) // Case-insensitive search
    .then((Rooms) => {
      res.send(Rooms);
    })
    .catch((err) => {
      console.error(err);
      console.log("1234567890");
      res.status(500).send("Error searching for Rooms by name");
    });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});