// frontend/src/features/auth/pages/LoginPage.jsx
import Header from '../../../components/Header';
import { LoginForm } from '../components/LoginForm';

export default function Login() {
  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-container">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
