import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [Roomname, setRoomname] = useState("");
  const [Hotel_ID, setHotel_ID] = useState("");
  const [Room_type, setRoom_type] = useState("");
  const [Price, setPrice] = useState("");
  const [Status, setStatus] = useState("");
  const [RoomList, setRoomList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoomListVisible, setIsRoomListVisible] = useState(false); // Add isRoomListVisible state

  const getRooms = () => {
    setIsLoading(true);
    Axios.get("http://localhost:3001/Rooms")
      .then((response) => {
        setRoomList(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isRoomListVisible) {
      getRooms();
    }
  }, [isRoomListVisible]);

  const toggleRoomList = () => {
    setIsRoomListVisible(!isRoomListVisible); // Toggle the Room list visibility
  };

  const addRoom = () => {
    Axios.post("http://localhost:3001/createRoom", {
      Room_ID: Roomname,
      Hotel_ID: Hotel_ID,
      Room_type: Room_type,
      Price: Price,
      Status: Status,
    }).then(() => {
      getRooms();
    });
  };

  const editRoom = (RoomId) => {
    const updatedRoomList = RoomList.map((Room) => {
      if (Room._id === RoomId) {
        return { ...Room, isEditing: true };
      }
      return Room;
    });
    setRoomList(updatedRoomList);
  };

  const saveRoom = (RoomId) => {
    const RoomToUpdate = RoomList.find((Room) => Room._id === RoomId);
    if (RoomToUpdate) {
      Axios.put(`http://localhost:3001/updateRoom/${RoomId}`, RoomToUpdate).then(() => {
        getRooms();
      });
    }
  };

  const cancelEdit = (RoomId) => {
    const updatedRoomList = RoomList.map((Room) => {
      if (Room._id === RoomId) {
        return { ...Room, isEditing: false };
      }
      return Room;
    });
    setRoomList(updatedRoomList);
  };

  const deleteRoom = (RoomId) => {
    Axios.delete(`http://localhost:3001/deleteRoom/${RoomId}`).then(() => {
      getRooms();
    });
  };

  // Function to search Rooms by name
const searchRoomsByName = (searchName) => {
  Axios.get(`http://localhost:3001/searchRoomsByName?name=${searchName}`)
    .then((response) => {
      setSearchResults(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

  return (
    <div className="App">
      <div className="information">
        <h1>Hotel Room Information</h1>
        <label>Room_ID:</label>
        <input
          type="number"
          onChange={(event) => {
            setRoomname(event.target.value);
          }}
        />
        <label>Hotel_ID:</label>
        <input
          type="number"
          onChange={(event) => {
            setHotel_ID(event.target.value);
          }}
        />
        <label>Room_type:</label>
        <select 
          onChange={(event) => {
            setRoom_type(event.target.value);
          }}
           style={{ width: '316px', height: '50px' }}
           
        >
          <option value="" disabled selected >Choose a room type</option>
          <option value="Standard">Standard</option>
          <option value="Suite">Suite</option>
          <option value="presidential suite">presidential suite</option>
          <option value="single room">single room</option>
        </select>
        <label>Price:</label>
        <input
          type="number"
          onChange={(event) => {
            setPrice(event.target.value);
          }}
        />
        <label>Status:</label>
        <select 
          onChange={(event) => {
            setStatus(event.target.value);
          }}
           style={{ width: '316px', height: '50px' }}
           
        >
          <option value="" disabled selected >Choose a status</option>
          <option value="Vacant">Vacant</option>
          <option value="Occupied">Occupied</option>
          <option value="Not Reserved">Not Reserved</option>
          <option value="Arrived">Arrived</option>
          <option value="Stayover">Stayover</option>
          <option value="No Show">No Show</option>
        </select>
        <button onClick={addRoom}className="blue-button">Add Room</button>
      </div>
      <div className="rooms">
        <h2>Room List</h2>
        <button onClick={toggleRoomList}className="blue-button">
          {isRoomListVisible ? "Hide Rooms" : "Show Rooms"} {/* Toggle button text */}
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : isRoomListVisible ? ( // Check if the Room list is visible
          RoomList.map((Room) => (
            <div className="room" key={Room._id}>
              <div>
                <h3>ID: {Room._id}</h3>
                {Room.isEditing ? (
                  // Edit Mode
                  <>
                    <input
                      type="number"
                      value={Room.Room_ID}
                      onChange={(e) => {
                        const updatedRoomList = RoomList.map((u) => {
                          if (u._id === Room._id) {
                            return { ...u, Room_ID: e.target.value };
                          }
                          return u;
                        });
                        setRoomList(updatedRoomList);
                      }}
                    />
                    <input
                      type="number"
                      value={Room.Hotel_ID}
                      onChange={(e) => {
                        const updatedRoomList = RoomList.map((u) => {
                          if (u._id === Room._id) {
                            return { ...u, Hotel_ID: e.target.value };
                          }
                          return u;
                        });
                        setRoomList(updatedRoomList);
                      }}
                    />
                    <input
                      type="text"
                      value={Room.Room_type}
                      onChange={(e) => {
                        const updatedRoomList = RoomList.map((u) => {
                          if (u._id === Room._id) {
                            return { ...u, Room_type: e.target.value };
                          }
                          return u;
                        });
                        setRoomList(updatedRoomList);
                      }}
                    />
                    <input
                      type="number"
                      value={Room.Price}
                      onChange={(e) => {
                        const updatedRoomList = RoomList.map((u) => {
                          if (u._id === Room._id) {
                            return { ...u, Price: e.target.value };
                          }
                          return u;
                        });
                        setRoomList(updatedRoomList);
                      }}
                    />
                    <input
                      type="text"
                      value={Room.Status}
                      onChange={(e) => {
                        const updatedRoomList = RoomList.map((u) => {
                          if (u._id === Room._id) {
                            return { ...u, Status: e.target.value };
                          }
                          return u;
                        });
                        setRoomList(updatedRoomList);
                      }}
                    />
                    <button onClick={() => saveRoom(Room._id)} className="blue-button" > Save</button>
                    <button onClick={() => cancelEdit(Room._id)} className="red-button" >Cancel</button>
                  </>
                ) : (
                  // Display Mode
                  <>
                    <h3>Room_ID: {Room.Room_ID}</h3>
                    <h3>Hotel_ID: {Room.Hotel_ID}</h3>
                    <h3>Room_type: {Room.Room_type}</h3>
                    <h3>Price: {Room.Price}</h3>
                    <h3>Status: {Room.Status}</h3>
                    <button onClick={() => editRoom(Room._id)} className="ore-button" >Edit</button>
                    <button onClick={() => deleteRoom(Room._id)} className="red-button" >Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : null}
      </div>
      <div className="searchrooms">
        <h2>Search Rooms</h2>
        <select
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            style={{ width: '316px', height: '50px' }}
          >
          <option value="" disabled selected >Choose a room type</option>
          <option value="Standard">Standard</option>
          <option value="Suite">Suite</option>
          <option value="presidential suite">presidential suite</option>
          <option value="single room">single room</option>
        </select>
        
        <button onClick={() => searchRoomsByName(searchQuery)} className="blue-button">Search</button>

      </div>

      <div className="rooms">
        <h2>Search Results</h2>
        {searchResults.map((result, index) => {
          return (
            <div className="roomh3" key={index}>
              <p>Room_ID: {result.Room_ID}</p>
              <p>Hotel_ID: {result.Hotel_ID}</p>
              <p>Room_type: {result.Room_type}</p>
              <p>Price: {result.Price}</p>
              <p>Status: {result.Status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;