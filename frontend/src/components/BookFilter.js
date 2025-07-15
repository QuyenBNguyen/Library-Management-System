// File: frontend/src/components/BookFilter.js
import React from 'react';
const styles = {
  filterWrapper: { backgroundColor: '#f5e6c9', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', border: '1px solid #83552d'},
  form: { display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1.5rem', alignItems: 'flex-end'},
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: '600', color: '#83552d', fontSize: '0.9rem', marginBottom: '0.5rem'},
  input: { padding: '0.9rem 1rem', border: '1px solid #83552d', borderRadius: '8px', backgroundColor: '#FFFFFF', fontSize: '1rem'},
  button: { backgroundColor: '#ffae00', color: '#543512', border: 'none', borderRadius: '8px', padding: '0.9rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '600'},
};
const BookFilter = () => (
  <div style={styles.filterWrapper}>
    <form style={styles.form}>
      <div style={styles.inputGroup}><label style={styles.label}>Search</label><input type="text" style={styles.input} /></div>
      <div style={styles.inputGroup}><label style={styles.label}>Genre</label><select style={styles.input}><option>All</option></select></div>
      <div style={styles.inputGroup}><label style={styles.label}>Status</label><select style={styles.input}><option>All</option></select></div>
      <button type="submit" style={styles.button}>Filter</button>
    </form>
  </div>
);
export default BookFilter;