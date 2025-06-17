import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; 

const GoogleLoginButton = ({ fullWidth = true }) => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      fullWidth={fullWidth}
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '10px',
        marginBottom: '16px',
        borderColor: '#ccc',
        color: '#333',
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#f1f1f1',
        },
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
