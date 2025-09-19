import React, { useEffect, useState } from "react";
import { requestForToken, messaging } from "../../configs/firebase";
import { onMessage } from "firebase/messaging";

export const NotificationButton: React.FC = () => {
  const [, setDeviceToken] = useState<string | null>(null);
  const [, setNotification] = useState<any>(null);

  const getPermissionandNotify = async () => {
    const isPermit = await Notification.requestPermission();
    if (isPermit === "granted") {
      requestForToken().then((token) => {
        if (token) {
          setDeviceToken(token);
        }
      });
    } else {
      alert("Notification permission denied");
    }
  };

  useEffect(() => {
    getPermissionandNotify();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received (foreground): ", payload);
      setNotification(payload.notification);
    });

    return () => unsubscribe();
  }, []);

  const handleTestNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    new Notification("Test Notification", {
      body: "This is a test notification from your React app.",
      icon: "/hello.png",
    });
  };

  return (
    <div className="relative py-10 sm:py-0">
      <button
        onClick={handleTestNotification}
        className="px-4 py-2 w-fit bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
      >
        Get Notification
      </button>
    </div>
  );
};
