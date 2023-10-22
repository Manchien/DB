import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [Room_ID, setRoom_ID] = useState(""); // 新增 Room_ID 狀態
  const [Hotel_ID, setHotel_ID] = useState("");
  const [Room_type, setRoom_type] = useState("");
  const [Price, setPrice] = useState(0);
  const [Status, setStatus] = useState("");

  const [roomList, setRoomList] = useState([]);
  const [showRoomList, setShowRoomList] = useState(false);


  // 取得所有 room 資料
  const getRooms = () => {
    Axios.get("http://localhost:3001/room").then((response) => {
      setRoomList(response.data);
    });
  };

  // 新增一個 room 資料
  const addRoom = () => {
    Axios.post("http://localhost:3001/create", {
      Room_ID: Room_ID,
      Hotel_ID: Hotel_ID,
      Room_type: Room_type,
      Price: Price,
      Status: Status,
    }).then(() => {
      getRooms([
        ...roomList,
        {
          Room_ID: Room_ID,
          Hotel_ID: Hotel_ID,
          Room_type: Room_type,
          Price: Price,
          Status: Status,
        }
      ])
      // 清空輸入欄位
      setRoom_ID("");
      setHotel_ID("");
      setRoom_type("");
      setPrice(0);
      setStatus("");
      // 重新取得所有 room 資料
      //getRooms();
    });
  };
  
  const updateRoom = (Room_ID) => {
    Axios.put(`http://localhost:3001/update/${Room_ID}`, { 
      Room_ID: Room_ID,
      Price: Price
    }).then((response) => {
        setPrice(0);
        console.log("Update response: ", response.data); // 打印更新后的数据
        setRoomList((prevRoomList) => {
          return prevRoomList.map((room) => {
              if (room.Room_ID === Room_ID) {
                // 如果 Room_ID 匹配，更新 Price
                return { ...room, Price: Price };
              } else {
                // 否则返回原始 room 数据
                return room;
              }
            })
        })
       });
    };

  // 刪除指定 Room_ID 的 room 資料
  const deleteRoom = (Room_ID) => {
    Axios.delete(`http://localhost:3001/delete/${Room_ID}`).then(() => {
      // 重新取得所有 room 資料
      getRooms();
    });
  };

  useEffect(() => {
    // 載入時取得所有 room 資料
    getRooms();
  }, []);

  return (
    <div className="App">
      <div className="information">
        <h1>Hotel Room Information</h1>
        <label>Room_ID:</label>
        <input
          type="text"
          value={Room_ID}
          onChange={(event) => {
            setRoom_ID(event.target.value);
          }}
        />
        <label>Hotel_ID:</label>
          <input
            type="text"
            value={Hotel_ID}
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
            value={Price}
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
        <button onClick={addRoom}className="blue-button" >Add Room</button>
      </div>
      <div className="rooms">
      <button onClick={() => setShowRoomList(true)} className="blue-button">
  Show Rooms
</button>
  {showRoomList && (
  roomList.map((room) => (
    <div className="room" key={room.Room_ID}>
      <div>
        <h3>Room_ID: {room.Room_ID}</h3>
        <h3>Hotel_ID: {room.Hotel_ID}</h3>
        <h3>Room_type: {room.Room_type}</h3>
        <h3>Price: {room.Price}</h3>
        <h3>Status: {room.Status}</h3>
      </div>
      <div>
        <input
          type="number"
          placeholder="Enter price..."
          onChange={(event) => {
            setPrice(event.target.value);
          }}
        />
        <button
          onClick={() => {
            updateRoom(room.Room_ID);
          }}
          className="blue-button"
        >
          Update Price
        </button>
        <button
          onClick={() => {
            deleteRoom(room.Room_ID);
          }}
          className="delete-button"
        >
          Delete room
        </button>
      </div>
    </div>
  ))
)}

      </div>
    </div>
  );
}

export default App;
