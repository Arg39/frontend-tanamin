import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import Template from '../../../template/template';
import { useLocation } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import useNotificationStore from '../../../zustand/public/notificationStore';

export default function Notification() {
  const location = useLocation();
  const { notifications, loading, error, fetchNotifications, markAsRead } = useNotificationStore();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Notifikasi', path: location.pathname },
  ];

  const handleToggleDropdown = (notif) => {
    if (openDropdownId === notif.id) {
      setOpenDropdownId(null);
      return;
    }
    setOpenDropdownId(notif.id);
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
  };

  return (
    <Template activeNav="notifikasi" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">Notifikasi</h1>
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center text-gray-400 py-16 min-h-[300px]">
              <span>Loading...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-red-400 py-16 min-h-[300px]">
              <span>{error}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 py-16 min-h-[300px]">
              <Icon type="inbox" className="w-12 h-12 mb-4" />
              Tidak ada notifikasi.
            </div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex flex-col gap-2 p-4 rounded-lg shadow-sm border transition relative
                    ${notif.is_read ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1">
                      {!notif.is_read ? (
                        <span
                          className="inline-block w-3 h-3 bg-green-500 rounded-full"
                          title="Belum dibaca"
                        ></span>
                      ) : (
                        <span
                          className="inline-block w-3 h-3 bg-gray-300 rounded-full"
                          title="Sudah dibaca"
                        ></span>
                      )}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h2
                          className={`font-semibold cursor-pointer ${
                            notif.is_read ? 'text-gray-700' : 'text-green-700'
                          }`}
                          onClick={() => handleToggleDropdown(notif)}
                        >
                          {notif.title}
                        </h2>
                        <span className="text-xs text-gray-400 ml-4">
                          {new Date(notif.created_at).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {openDropdownId === notif.id && (
                    <div className="mt-3 bg-white border border-green-200 rounded-lg shadow-lg p-4 z-10">
                      <p className="text-gray-700 font-semibold mb-1">{notif.title}</p>
                      <p className="text-gray-600">{notif.body}</p>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(notif.created_at).toLocaleString('id-ID', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Template>
  );
}
