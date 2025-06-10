import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClients, createClient, updateClient, deleteClient } from "../api";
import CheckInForm from "../components/CheckInForm";
import { ACCES_TOKEN } from "../constants";
import "../styles/Clients.css";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCES_TOKEN);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClients();
  }, [token, navigate]);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleCreate = async (clientData) => {
    try {
      await createClient(clientData);
      await fetchClients();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Create error details:", error.response?.data);
      alert(`Ошибка: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const handleUpdate = async (clientData) => {
    try {
      await updateClient(editingClient.id, clientData);
      await fetchClients();
      setEditingClient(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Update error details:", error.response?.data);
      alert(`Ошибка: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id);
      await fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1>Клиенты гостиницы</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setIsFormOpen(true);
          }}
          className="add-client-btn"
        >
          Добавить клиента
        </button>
      </div>

      {isFormOpen && (
        <div className="client-form-container">
          <CheckInForm
            onSubmit={editingClient ? handleUpdate : handleCreate}
            initialData={editingClient || {}}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <div className="clients-list-container">
        <ul className="clients-list">
          {clients.map((client) => (
            <li key={client.id} className="client-item">
              <div className="client-info">
                <h3>
                  {client.last_name} {client.first_name}
                </h3>
                <p>
                  Комната: {client.room_number} | Паспорт: {client.passport}
                </p>
                {client.check_out_date && (
                  <p>
                    Выезд:{" "}
                    {new Date(client.check_out_date).toLocaleDateString()}
                  </p>
                )}
                {client.notes && <p>Примечания: {client.notes}</p>}
              </div>
              <div className="client-actions">
                <button onClick={() => handleEdit(client)} className="edit-btn">
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="delete-btn"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
