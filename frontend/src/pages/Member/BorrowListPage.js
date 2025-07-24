import React, { useEffect, useState } from "react";
import borrowApi from "../../api/loanApi";
import paymentApi from "../../api/paymentApi";

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: "2rem auto",
    background: "#f5e6c9",
    borderRadius: 16,
    padding: "2rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#543512",
    marginBottom: "2rem",
    textAlign: "center",
  },
  tabBar: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    justifyContent: "center",
  },
  tab: (isActive) => ({
    padding: "0.7rem 2.2rem",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: "1.1rem",
    background: isActive ? "#ffae00" : "#e1bb80",
    color: isActive ? "#543512" : "#83552d",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  th: {
    background: "#83552d",
    color: "#f5e6c9",
    padding: "1rem",
    fontWeight: 600,
    fontSize: "1rem",
    borderBottom: "2px solid #543512",
  },
  td: {
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #e1bb80",
    color: "#543512",
    fontSize: "1rem",
    textAlign: "center",
  },
};

const TABS = [
  { key: "borrowing", label: "Borrowing" },
  { key: "reserving", label: "Reserving" },
  { key: "overdue", label: "Overdue" },
];

const BorrowListPage = () => {
  const [tab, setTab] = useState("borrowing");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTab = async () => {
      try {
        setLoading(true);
        setError(null);
        let res;
        if (tab === "borrowing") res = await borrowApi.getBorrowing();
        else if (tab === "reserving") res = await borrowApi.getReserving();
        else if (tab === "overdue") res = await borrowApi.getOverdue();
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch your borrow list.");
      } finally {
        setLoading(false);
      }
    };
    fetchTab();
  }, [tab]);

  const handlePayFine = async (borrowBookId) => {
    try {
      const res = await paymentApi.createPaymentUrl(borrowBookId);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Failed to get payment URL.");
      }
    } catch (err) {
      alert("Failed to initiate payment.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>My Borrowed Books</div>
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.key}
            style={styles.tab(tab === t.key)}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ color: "#543512", textAlign: "center", margin: "2rem" }}>
          Loading...
        </div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "2rem" }}>
          {error}
        </div>
      ) : data.length === 0 ? (
        <div style={{ color: "#543512", textAlign: "center", margin: "2rem" }}>
          No books found.
        </div>
      ) : (
        <>
          {tab === "reserving" && (
            <div
              style={{
                color: "#d9534f",
                textAlign: "center",
                marginBottom: "1.5rem",
                fontWeight: 600,
              }}
            >
              Please come to the library to get your reserved books within 7
              days, or your reservation will be cancelled.
            </div>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Checkout Date</th>
                <th style={styles.th}>Due Date</th>
                {tab === "overdue" && <th style={styles.th}>Overdue Days</th>}
                {tab === "overdue" && <th style={styles.th}>Fine</th>}
                {tab === "overdue" && <th style={styles.th}></th>}
              </tr>
            </thead>
            <tbody>
              {data?.map((bb) => (
                <tr key={bb._id}>
                  <td style={styles.td}>{bb.book?.title || "-"}</td>
                  <td style={styles.td}>{bb.book?.author || "-"}</td>
                  <td style={styles.td}>
                    {bb.borrowSession?.borrowDate
                      ? new Date(
                          bb.borrowSession.borrowDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={styles.td}>
                    {bb.borrowSession?.dueDate
                      ? new Date(bb.borrowSession?.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  {tab === "overdue" && (
                    <td style={styles.td}>{bb.overdueDay || 0}</td>
                  )}
                  {tab === "overdue" && (
                    <td style={styles.td}>
                      {bb.fineAmount
                        ? `${bb.fineAmount.toLocaleString()}₫`
                        : "-"}
                    </td>
                  )}
                  {tab === "overdue" && (
                    <td style={styles.td}>
                      {bb.fineAmount > 0 && (
                        <button
                          style={{
                            background: "#ffae00",
                            color: "#543512",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.5rem 1.2rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          onClick={() => handlePayFine(bb._id)}
                        >
                          Pay Fine
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BorrowListPage;
