import React from "react";

const TestRegisterPage = () => {
  return (
    <div style={{
      background: '#543512',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{
        background: '#e1bb80',
        padding: '40px',
        borderRadius: '16px',
        color: '#1f1f1f'
      }}>
        <h1>Test Register Page</h1>
        <p>If you can see this, the routing is working!</p>
        <form>
          <input type="text" placeholder="Name" style={{padding: '10px', margin: '10px', width: '200px'}} />
          <br />
          <input type="email" placeholder="Email" style={{padding: '10px', margin: '10px', width: '200px'}} />
          <br />
          <input type="password" placeholder="Password" style={{padding: '10px', margin: '10px', width: '200px'}} />
          <br />
          <button type="submit" style={{padding: '10px 20px', margin: '10px'}}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestRegisterPage;