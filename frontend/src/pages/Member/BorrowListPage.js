import React, { useEffect, useState } from 'react';
import borrowApi from '../../api/loanApi';
import paymentApi from '../../api/paymentApi';

const styles = {
  wrapper: { maxWidth: 900, margin: '2rem auto', background: '#f5e6c9', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#543512', marginBottom: '2rem', textAlign: 'center' },
  tabBar: { display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' },
  tab: isActive => ({ padding: '0.7rem 2.2rem', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', background: isActive ? '#ffae00' : '#e1bb80', color: isActive ? '#543512' : '#83552d', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }),
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' },
  th: { background: '#83552d', color: '#f5e6c9', padding: '1rem', fontWeight: 600, fontSize: '1rem', borderBottom: '2px solid #543512' },
  td: { padding: '0.8rem 1rem', borderBottom: '1px solid #e1bb80', color: '#543512', fontSize: '1rem', textAlign: 'center' },
};

const TABS = [
  { key: 'borrowing', label: 'Borrowing' },
  { key: 'reserving', label: 'Reserving' },
  { key: 'overdue', label: 'Overdue' },
];

const getSelectedTotal = (selected, data) => {
  return data.filter(bb => selected.includes(bb._id)).reduce((sum, bb) => sum + (bb.fineAmount || 0), 0);
};

const BorrowListPage = () => {
  const [tab, setTab] = useState('borrowing');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchTab = async () => {
      try {
        setLoading(true);
        setError(null);
        let res;
        if (tab === 'borrowing') res = await borrowApi.getBorrowing();
        else if (tab === 'reserving') res = await borrowApi.getReserving();
        else if (tab === 'overdue') res = await borrowApi.getOverdue();
        setData(Array.isArray(res.data) ? res.data : []);
        setSelected([]); // reset selection on tab change
      } catch (err) {
        setError('Failed to fetch your borrow list.');
      } finally {
        setLoading(false);
      }
    };
    fetchTab();
  }, [tab]);

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === data.length) setSelected([]);
    else setSelected(data.map(bb => bb._id));
  };

  const handlePayFine = async () => {
    if (selected.length === 0) return;
    try {
      const res = await paymentApi.createPaymentUrl(selected);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert('Failed to get payment URL.');
      }
    } catch (err) {
      alert('Failed to initiate payment.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>My Borrowed Books</div>
      <div style={styles.tabBar}>
        {TABS.map(t => (
          <button key={t.key} style={styles.tab(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      {loading ? (
        <div style={{ color: '#543512', textAlign: 'center', margin: '2rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', margin: '2rem' }}>{error}</div>
      ) : data.length === 0 ? (
        <div style={{ color: '#543512', textAlign: 'center', margin: '2rem' }}>No books found.</div>
      ) : (
        <>
          {tab === 'reserving' && (
            <div style={{ color: '#d9534f', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
              Please come to the library to get your reserved books within 7 days, or your reservation will be cancelled.
            </div>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                {tab === 'overdue' && <th style={styles.th}><input type="checkbox" checked={selected.length === data.length && data.length > 0} onChange={handleSelectAll} /></th>}
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Checkout Date</th>
                <th style={styles.th}>Due Date</th>
                {tab === 'overdue' && <th style={styles.th}>Overdue Days</th>}
                {tab === 'overdue' && <th style={styles.th}>Fine</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((bb) => (
                <tr key={bb._id}>
                  {tab === 'overdue' && <td style={styles.td}><input type="checkbox" checked={selected.includes(bb._id)} onChange={() => handleSelect(bb._id)} /></td>}
                  <td style={styles.td}>{bb.book?.title || '-'}</td>
                  <td style={styles.td}>{bb.book?.author || '-'}</td>
                  <td style={styles.td}>{bb.borrowSession?.borrowDate ? new Date(bb.borrowSession.borrowDate).toLocaleDateString() : '-'}</td>
                  <td style={styles.td}>{bb.borrowSession?.dueDate ? new Date(bb.borrowSession?.dueDate).toLocaleDateString() : '-'}</td>
                  {tab === 'overdue' && <td style={styles.td}>{bb.overdueDay || 0}</td>}
                  {tab === 'overdue' && <td style={styles.td}>{bb.fineAmount ? `${bb.fineAmount.toLocaleString()}₫` : '-'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          {tab === 'overdue' && (
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', marginRight: 24 }}>
                Total Fine: {getSelectedTotal(selected, data).toLocaleString()}₫
              </span>
              <button
                style={{ background: '#ffae00', color: '#543512', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 700, fontSize: '1.1rem', cursor: selected.length === 0 ? 'not-allowed' : 'pointer', opacity: selected.length === 0 ? 0.5 : 1 }}
                disabled={selected.length === 0}
                onClick={handlePayFine}
              >
                Pay Fine
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BorrowListPage; 