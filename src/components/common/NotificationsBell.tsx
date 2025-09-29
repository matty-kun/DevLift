import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { formatNotification } from '../../lib/notifications';
import { Link } from 'react-router-dom';

const NotificationsBell: React.FC = () => {
  const { notifications, unreadCount, markOne, markAll } = useNotifications();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative bg-neutral-900 p-2 rounded-full hover:bg-neutral-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-custom-orange" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] flex items-center justify-center bg-custom-orange text-black rounded-full">{unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
            <span className="text-sm font-semibold text-neutral-200">Notifications</span>
            <button className="text-xs text-custom-cyan hover:underline" onClick={() => { markAll(); }}>Mark all read</button>
          </div>
          <ul className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <li className="px-3 py-4 text-neutral-500 text-sm">You're all caught up.</li>
            ) : notifications.map(n => {
              const fm = formatNotification(n);
              const content = (
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-100">{fm.title}</span>
                  {fm.body && <span className="text-xs text-neutral-400">{fm.body}</span>}
                  <span className="text-[10px] text-neutral-500 mt-1">{new Date(n.created_at).toLocaleString()}</span>
                </div>
              );
              return (
                <li key={n.id} className={`px-3 py-3 border-b border-neutral-800 ${!n.read_at ? 'bg-neutral-900' : ''}`}>
                  <div className="flex items-start gap-2">
                    <span className={`h-2 w-2 rounded-full mt-2 ${!n.read_at ? 'bg-custom-orange' : 'bg-neutral-700'}`}></span>
                    <div className="flex-1">
                      {fm.href ? (
                        <Link to={fm.href} className="block hover:underline" onClick={() => { markOne(n.id); setOpen(false); }}>{content}</Link>
                      ) : (
                        <button className="text-left w-full" onClick={() => markOne(n.id)}>{content}</button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
