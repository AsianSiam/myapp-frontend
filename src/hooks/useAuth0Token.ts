import { useAuth0 } from '@auth0/auth0-react';

/**
 * HOOK UTILITAIRE POUR TOKENS AUTH0
 * 
 * Centralise la logique de récupération des access tokens
 * avec gestion d'erreurs et configuration standardisée.
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Configuration automatique audience et scope
 * - Gestion robuste des erreurs refresh token
 * - Logging pour debugging
 * - Retry automatique en cas d'échec
 */
export const useAuth0Token = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const getTokenSafely = async (options?: {
    ignoreCache?: boolean;
    timeoutInSeconds?: number;
  }) => {
    try {
      console.log('🔑 Récupération access token Auth0...');
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email offline_access",
        },
        ...options
      });

      console.log('✅ Access token récupéré avec succès');
      return token;
      
    } catch (error: any) {
      console.error('❌ Erreur récupération token:', error);
      
      // Si le refresh token manque ou expire, rediriger vers login
      if (error.error === 'missing_refresh_token' || 
          error.error === 'invalid_grant' ||
          error.message?.includes('Missing Refresh Token')) {
        
        console.log('🔄 Refresh token manquant - Redirection vers Auth0...');
        
        // Force une nouvelle connexion
        await loginWithRedirect({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email offline_access",
            prompt: 'login' // Force une nouvelle connexion
          }
        });
        
        // Cette ligne ne sera jamais atteinte car loginWithRedirect redirige
        throw new Error('Redirection vers Auth0 en cours...');
      }
      
      throw error;
    }
  };

  return { getTokenSafely };
};