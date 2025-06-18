import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getClients,
  createDocument,
  getClientDocuments,
  getRooms,
} from "../api.js";
import { ACCES_TOKEN } from "../constants";
import "../styles/Documents.css";

export default function Documents() {
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [documentData, setDocumentData] = useState({
    doc_type: "contract",
    check_in_date: "",
    check_out_date: "",
    total_amount: "0.00",
    content: "",
  });

  // Загрузка данных при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, roomsData] = await Promise.all([
          getClients(),
          getRooms(),
        ]);
        setClients(clientsData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);

  // Находим номер выбранного клиента
  const clientRoom = selectedClient
    ? rooms.find((r) => r.number === selectedClient.room_number?.toString())
    : null;

  // Расчет количества дней
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  };

  // Расчет суммы оплаты (исправленная версия)
  const calculateAmount = (start, end, price) => {
    if (!price) return "0.00"; // Добавили проверку на цену
    const days = calculateDays(start, end);
    return (days * price).toFixed(2);
  };

  // Обработчик выбора клиента (исправленная версия)
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c.id == clientId);
    setSelectedClient(client);

    if (client) {
      const checkInDate = client.check_in_date?.split("T")[0] || "";
      const checkOutDate = client.check_out_date?.split("T")[0] || "";
      const price = clientRoom?.price_per_night || 0;

      setDocumentData({
        ...documentData,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_amount: calculateAmount(checkInDate, checkOutDate, price),
      });
    }
  };

  // Обработчик изменения дат (исправленная версия)
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...documentData,
      [name]: value,
    };

    if (clientRoom?.price_per_night) {
      newData.total_amount = calculateAmount(
        name === "check_in_date" ? value : documentData.check_in_date,
        name === "check_out_date" ? value : documentData.check_out_date,
        clientRoom.price_per_night
      );
    }

    setDocumentData(newData);
  };

  // Генерация содержания документа (упрощенная версия)
  const generateDocumentContent = () => {
    if (!selectedClient) return "";

    const days = calculateDays(
      documentData.check_in_date,
      documentData.check_out_date
    );
    const price = clientRoom?.price_per_night || 0;

    return `
        ДОГОВОР АРЕНДЫ №${documentData.id || "временный"}
        г. Ростов-на-Дону, ${new Date().toLocaleDateString("ru-RU")}
        
        АРЕНДОДАТЕЛЬ: Гостиница "Курсач"
        АРЕНДАТОР: ${selectedClient.last_name} ${selectedClient.first_name}
        Паспорт: ${selectedClient.passport}
        
        ИНФОРМАЦИЯ О НОМЕРЕ:
        Номер: ${
          clientRoom?.number || selectedClient.room_number || "Не указан"
        }
        Тип: ${clientRoom?.room_type || "Не указан"}
        Вместимость: ${clientRoom?.capacity || "Не указана"} чел.
        Цена за ночь: ${price} руб.
        
        СРОК АРЕНДЫ:
        Заезд: ${documentData.check_in_date || "не указана"}
        Выезд: ${documentData.check_out_date || "не указана"}
        Количество дней: ${days}
        
        СУММА К ОПЛАТЕ: ${calculateAmount(documentData.check_in_date, documentData.check_out_date, clientRoom.price_per_night)} руб.
        ${
          price > 0
            ? `(${price} руб. × ${days} ${days === 1 ? "день" : "дней"})`
            : ""
        }
        
        УСЛОВИЯ:
        1. Оплата производится в полном объеме
        2. При отмене брони менее чем за 3 дня удерживается 50% стоимости
        3. Дополнительные услуги оплачиваются отдельно
        
        Подпись Арендодателя: _________________
        Подпись Арендатора: __________________
      `;
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) {
      alert("Пожалуйста, выберите клиента");
      return;
    }

    try {
      const content = generateDocumentContent();
      const response = await createDocument({
        ...documentData,
        content,
        client: selectedClient.id,
      });

      alert(`Документ создан! ID: ${response.id}`);
      window.open("", "_blank").document.write(`<pre>${content}</pre>`);
    } catch (error) {
      console.error("Ошибка:", error.response?.data || error.message);
      alert("Ошибка при создании документа");
    }
  };

  return (
    <div className="documents-container">
      <h1>Генерация документов</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Тип документа:</label>
          <select
            name="doc_type"
            value={documentData.doc_type}
            onChange={(e) =>
              setDocumentData({ ...documentData, doc_type: e.target.value })
            }
          >
            <option value="contract">Договор аренды</option>
            <option value="invoice">Счет на оплату</option>
            <option value="act">Акт оказанных услуг</option>
          </select>
        </div>

        <div className="form-group">
          <label>Клиент:</label>
          <select onChange={handleClientChange} required>
            <option value="">Выберите клиента</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.last_name} {client.first_name} (Комната:{" "}
                {client.room_number})
              </option>
            ))}
          </select>
        </div>

        {selectedClient && (
          <>
            <div className="client-info">
              <h3>Данные клиента:</h3>
              <p>
                ФИО: {selectedClient.last_name} {selectedClient.first_name}
              </p>
              <p>Паспорт: {selectedClient.passport}</p>

              <h4>Информация о номере:</h4>
              {clientRoom ? (
                <>
                  <p>Номер: {clientRoom.number}</p>
                  <p>Тип: {clientRoom.room_type}</p>
                  <p>Вместимость: {clientRoom.capacity} чел.</p>
                  <p>Цена за ночь: {clientRoom.price_per_night} руб.</p>
                </>
              ) : (
                <p>Номер {selectedClient.room_number} не найден в базе</p>
              )}
            </div>

            <div className="form-group">
              <label>Дата заезда:</label>
              <input
                type="date"
                name="check_in_date"
                value={documentData.check_in_date}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Дата выезда:</label>
              <input
                type="date"
                name="check_out_date"
                value={documentData.check_out_date}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Сумма к оплате:</label>
              <div className="amount-display">
                {calculateAmount(documentData.check_in_date, documentData.check_out_date, clientRoom.price_per_night)} руб.
                    <span className="amount-breakdown">
                      ({clientRoom.price_per_night} руб. ×{" "}
                      {calculateDays(
                        documentData.check_in_date,
                        documentData.check_out_date
                      )}{" "}
                      дней)
                    </span>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Сгенерировать документ
            </button>
          </>
        )}
      </form>
    </div>
  );
}
