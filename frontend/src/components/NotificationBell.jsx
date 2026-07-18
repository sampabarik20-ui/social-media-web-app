import React, { useEffect, useState } from "react";
import api from "../api";
import socket from "../socket";
import { BsBellFill } from "react-icons/bs";

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  

  useEffect(() => {
  if (!userId) return;

  const loadNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  loadNotifications();

  socket.emit("joinRoom", userId);

  socket.on("notification", () => {
    loadNotifications();
  });

  return () => {
    socket.off("notification");
  };
}, [userId]); 

  const handleMarkAsRead = async (notificationId) => {
  try {
    await api.put(`notifications/read/${notificationId}`);

    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  const clearAllNotifications = async () => {
  try {
    await api.delete("/notifications/clear");
    setNotifications([]);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="dropdown">
      <button
        className="btn btn-accent dropdown-toggle"
        type="button"
        id="notificationDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <BsBellFill />
        {notifications.some((notif) => !notif.read) && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        )}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end shadow"
        aria-labelledby="notificationDropdown"
        style={{ maxHeight: "400px", overflowY: "auto", zIndex: 1050 }}
      >
        {notifications.length === 0 && (
          <li>
            <p className="dropdown-item text-muted">No notifications yet.</p>
          </li>
        )}
        {notifications.map((notif) => (
          <li key={notif._id} className="dropdown-item d-flex justify-content-between">
            <div>{notif.message}</div>
            {!notif.read && (
              <button
                className="btn btn-link btn-sm text-primary"
                onClick={() => handleMarkAsRead(notif._id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
        {notifications.length > 0 && (
          <li>
            <button
              className="btn btn-danger btn-sm w-100 mt-2"
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NotificationBell;
