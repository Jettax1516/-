export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <div className="room-image">
        {/* <img src={room.image_url || '/default-roo   m.jpg'} alt={`Номер ${room.number}`} /> */}
      </div>
      <div className="room-info">
        <h3>Номер {room.number}</h3>
        <p>
          Тип:{" "}
          {room.room_type === "lux"
            ? "Люкс"
            : room.room_type === "suite"
            ? "Сьют"
            : room.room_type === "comfort"
            ? "Комфорт"
            : "Стандарт"}
        </p>
        <p>Вместимость: {room.capacity} чел.</p>
        <p>Цена: {room.price_per_night} руб./ночь</p>
        <button className="book-button">Забронировать</button>
      </div>
    </div>
  );
}
