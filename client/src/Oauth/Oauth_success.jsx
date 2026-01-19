import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { refreshUser, loading } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Backend has set httpOnly cookie, fetch user data
                const result = await refreshUser();
                if (result.success) {
                    navigate('/', { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('OAuth refresh failed:', error);
                navigate('/login', { replace: true });
            }
        };
        
        // Only fetch if not already loading
        if (!loading) {
            fetchUser();
        }
    }, [navigate, refreshUser, loading]);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: '#667eea',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Completing login...</p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OAuthSuccess;