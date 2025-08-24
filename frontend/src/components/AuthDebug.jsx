// Debug helper for Redux auth state
import { useSelector } from 'react-redux';

export const AuthDebug = () => {
    const authState = useSelector(state => state.auth);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#000',
            color: '#fff',
            padding: '10px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px',
            opacity: 0.8
        }}>
            <h4>Auth Debug</h4>
            <pre>{JSON.stringify(authState, null, 2)}</pre>
        </div>
    );
};
