// src/pages/Auth/LoginPage/LoginDebug.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginDebug = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      setResponse(res.data);
      
      // Store token
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert("Login successful! Token stored.");
        
        // Redirect based on role
        const role = res.data.user?.role;
        if (role === "admin") navigate("/dashboard/admin");
        else if (role === "instructor") navigate("/dashboard/instructor");
        else navigate("/dashboard");
      } else {
        alert("No token received in response!");
      }
    } catch (err) {
      setError({
        message: err.message,
        response: err.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Storage cleared!");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Login Debug Tool</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <button 
            type="submit"
            disabled={isLoading}
            style={{ 
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <button 
            type="button"
            onClick={clearStorage}
            style={{ 
              marginLeft: '10px',
              padding: '10px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Storage
          </button>
        </div>
      </form>
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <h3>Error:</h3>
          <p>{error.message}</p>
          {error.response && (
            <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {JSON.stringify(error.response, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {response && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <h3>Success Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>LocalStorage:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
          {localStorage.getItem('token') ? 
            `token: ${localStorage.getItem('token').substring(0, 20)}...` : 
            'No token found'}
        </pre>
      </div>
    </div>
  );
};

export default LoginDebug;