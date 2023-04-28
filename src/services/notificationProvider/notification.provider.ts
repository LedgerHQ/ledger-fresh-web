import { createContext, useContext } from "react";

export type GlobalContent = {
  notification: any;
  setNotification: any;
};

export const NotificationContext = createContext<GlobalContent>({
  notification: {},
  setNotification: (transaction: any) => {},
});
export const useNotificationContext = () => useContext(NotificationContext);
