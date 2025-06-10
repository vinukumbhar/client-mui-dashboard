import React, { useEffect, useState ,useContext} from 'react';
import { 
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,CircularProgress
} from '@mui/material';
import ProfilePictureUpload from './ProfilePictureUpload';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoginContext } from '../context/Context';
const UserProfile = () => {
     const { logindata } = useContext(LoginContext);
         const [loginUserId, setLoginUserId] = useState();
      console.log("login data",logindata)
        useEffect(() => {
        if (logindata?.user?.id) {
          setLoginUserId(logindata.user.id);
         
        }
      }, [logindata]);
//   const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1/common/user/${loginUserId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        console.log("user data in settings",response.data)
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [loginUserId]);
  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Usage:
// const formattedDate = formatDate(user.createdAt); // "02-June-2025"

  const handleUploadSuccess = (newImageUrl) => {
    setUser(prev => ({
      ...prev,
      profilePicture: newImageUrl
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" my={4}>
          User not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: 1 }}>
              <ProfilePictureUpload 
                userId={loginUserId}
                currentImage={user.profilePicture}
                onUploadSuccess={handleUploadSuccess}
              />
            </Box>
            
            <Box sx={{ flex: 2 }}>
              <Typography variant="h6" gutterBottom color='primary.main'>
                {user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Member Since:</strong> {formatDate(user.createdAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;