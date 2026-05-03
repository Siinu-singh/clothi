'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { ToastProvider } from '../../context/ToastContext';
import { LoginPromptProvider } from '../../context/LoginPromptContext';
import { CollectionProvider } from '../../context/CollectionContext';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ToastProvider>
        <AuthProvider>
          <LoginPromptProvider>
            <CartProvider>
              <FavoritesProvider>
                <CollectionProvider>
                  {children}
                </CollectionProvider>
              </FavoritesProvider>
            </CartProvider>
          </LoginPromptProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
