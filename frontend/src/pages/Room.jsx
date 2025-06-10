import { useState, useEffect } from 'react';
import { getRooms } from '../api';
import RoomCard from '../components/RoomCard';
import "../styles/Room.css"

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    roomType: '',
    capacity: ''
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    let result = rooms;
    
    if (filters.roomType) {
      result = result.filter(room => room.room_type === filters.roomType);
    }
    
    if (filters.capacity) {
      result = result.filter(room => room.capacity >= parseInt(filters.capacity));
    }
    
    setFilteredRooms(result);
  }, [filters, rooms]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rooms-page">
      <div className="filters">
        <select 
          name="roomType" 
          value={filters.roomType}
          onChange={handleFilterChange}
        >
          <option value="">Все типы</option>
          <option value="standard">Стандарт</option>
          <option value="comfort">Комфорт</option>
          <option value="lux">Люкс</option>
          <option value="suite">Сьют</option>
        </select>

        <select 
          name="capacity" 
          value={filters.capacity}
          onChange={handleFilterChange}
        >
          <option value="">Любая вместимость</option>
          <option value="1">1 человек</option>
          <option value="2">2 человека</option>
          <option value="3">3 человека</option>
          <option value="4">4+ человека</option>
        </select>
      </div>

      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
