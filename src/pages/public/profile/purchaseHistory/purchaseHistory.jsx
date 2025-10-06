import React, { useEffect } from 'react';
import ProfileSidebar from '../profileSidebar';
import usePurchaseHistoryStore from '../../../../zustand/public/purchaseHistoryStore';
import { useNavigate } from 'react-router-dom';
import { capitalizeWords } from '../../../../components/dragAndDrop/utils'; // import capitalizeWords

const statusLabel = {
  paid: 'Sukses',
  pending: 'Menunggu Pembayaran',
  expired: 'Dibatalkan',
};

const statusColor = {
  paid: 'bg-primary-300 text-primary-900',
  pending: 'bg-tertiary-300 text-tertiary-900',
  expired: 'bg-error-300 text-error-800',
};

// Fungsi format harga pakai utils
function formatHarga(harga) {
  if (typeof harga !== 'number') return '';
  return harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const { data, loading, error, fetchPurchaseHistory } = usePurchaseHistoryStore();

  useEffect(() => {
    fetchPurchaseHistory();
  }, [fetchPurchaseHistory]);

  const tableData = data?.data || [];

  return (
    <ProfileSidebar activeNav={'riwayat-pembelian'}>
      <div className="min-h-[660px] bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold border-b-2 pb-4 mb-6">Riwayat Pembelian</h1>
        {loading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-center text-red-600 py-8">{error}</div>}

        {/* Desktop Table */}
        {!loading && !error && (
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-tertiary-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-36">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-64">
                    Nama Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tableData.map((item, idx) => (
                  <tr key={item.order_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 w-36">
                      {item.order_id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 w-64 max-w-xs">
                      <button
                        onClick={() => {
                          navigate(`/kursus/${item.course_id}`);
                        }}
                        className="truncate max-w-[220px] text-left hover:underline hover:text-primary-700"
                        title={item.nama_course}
                        style={{ display: 'block', whiteSpace: 'normal', wordBreak: 'break-word' }}
                      >
                        {capitalizeWords(item.nama_course)}
                      </button>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 w-40">
                      {item.tanggal}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 w-40">
                      {formatHarga(item.total)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm w-40">
                      <span
                        className={`min-w-[140px] flex justify-center items-center p-1 px-2 rounded-md font-normal mx-auto ${
                          statusColor[item.status] || 'bg-gray-400'
                        }`}
                      >
                        {statusLabel[item.status] || item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      Tidak ada riwayat pembelian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card List */}
        {!loading && !error && (
          <div className="block sm:hidden">
            {tableData.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border border-gray-200 rounded bg-white shadow">
                Tidak ada riwayat pembelian.
              </div>
            ) : (
              tableData.map((item, idx) => (
                <div
                  key={item.order_id}
                  className="border border-gray-200 rounded-lg mb-4 p-4 bg-white shadow"
                >
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Order ID:</span>
                    <span className="ml-2 text-gray-800">{item.order_id}</span>
                  </div>
                  <div className="mb-2 flex flex-col">
                    <span className="font-semibold text-gray-600">Nama Course:</span>
                    <button
                      onClick={() => {
                        navigate(`/kursus/${item.course_id}`);
                      }}
                      className="text-primary-700 underline break-words text-left mt-1"
                      style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                      title={item.nama_course}
                    >
                      {capitalizeWords(item.nama_course)}
                    </button>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Tanggal:</span>
                    <span className="ml-2 text-gray-800">{item.tanggal}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Total:</span>
                    <span className="ml-2 text-gray-800">{formatHarga(item.total)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Status:</span>
                    <span
                      className={`ml-2 min-w-[100px] inline-flex justify-center items-center p-1 px-2 rounded-md font-normal ${
                        statusColor[item.status] || 'bg-gray-400'
                      }`}
                    >
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ProfileSidebar>
  );
}
