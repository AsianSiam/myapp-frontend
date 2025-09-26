import { useAuth0 } from "@auth0/auth0-react";

/**
 * CONFIGURATION AUTH0 CENTRALISÉE
 * 
 * Configuration unique pour tous les paramètres Auth0 de l'application.
 * Utilise les variables d'environnement pour une flexibilité maximale.
 * 
 * 🔧 AVANTAGES :
 * - Configuration centralisée en un seul endroit
 * - Variables d'environnement pour tous les domaines/URLs
 * - Fallback intelligent si variable manquante
 * - Hook personnalisé pour logout uniforme
 * 
 * 🌐 ENVIRONNEMENTS :
 * - Développement : localhost:5173
 * - Staging : votre-app-staging.com
 * - Production : votre-app.com
 */

export const auth0Config = {
  // Configuration principale Auth0
  domain: import.meta.env.VITE_AUTH0_DOMAIN!,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID!,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE!,
  
  // URLs de redirection avec fallback intelligent
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL!,
  logoutUrl: import.meta.env.VITE_LOGOUT_REDIRECT_URL || 
             (() => {
               // Fallback : extraire l'origine de la callback URL + "/"
               try {
                 return new URL('/', import.meta.env.VITE_AUTH0_CALLBACK_URL!).href;
               } catch {
                 // Fallback ultime : origine actuelle
                 return `${window.location.origin}/`;
               }
             })(),
  
  // Scopes standardisés
  scope: "openid profile email offline_access"
} as const;

/**
 * HOOK PERSONNALISÉ POUR LOGOUT
 * 
 * Centralise la logique de déconnexion avec redirection automatique
 * vers l'URL configurée dans les variables d'environnement.
 * 
 * @returns Fonction de déconnexion configurée
 */
export const useAuth0Logout = () => {
  const { logout } = useAuth0();
  
  return () => {
    console.log('🔓 Déconnexion en cours - Redirection vers:', auth0Config.logoutUrl);
    
    logout({
      logoutParams: {
        returnTo: auth0Config.logoutUrl
      }
    });
  };
};

/**
 * HOOK PERSONNALISÉ POUR LOGIN
 * 
 * Centralise la logique de connexion avec paramètres standardisés.
 * 
 * @param returnTo URL de retour optionnelle après connexion
 * @returns Fonction de connexion configurée
 */
export const useAuth0Login = (returnTo?: string) => {
  const { loginWithRedirect } = useAuth0();
  
  return () => {
    const targetUrl = returnTo || window.location.pathname + window.location.search;
    
    console.log('🔐 Connexion en cours - Retour prévu vers:', targetUrl);
    
    loginWithRedirect({
      authorizationParams: {
        audience: auth0Config.audience,
        scope: auth0Config.scope,
        redirect_uri: auth0Config.callbackUrl
      },
      appState: {
        returnTo: targetUrl
      }
    });
  };
};

/**
 * VALIDATION DE LA CONFIGURATION
 * 
 * Vérifie que toutes les variables d'environnement requises sont présentes.
 * Utile pour le debugging et la validation d'environnement.
 */
export const validateAuth0Config = () => {
  const requiredEnvVars = [
    'VITE_AUTH0_DOMAIN',
    'VITE_AUTH0_CLIENT_ID', 
    'VITE_AUTH0_CALLBACK_URL',
    'VITE_AUTH0_AUDIENCE'
  ];
  
  const missing = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement Auth0 manquantes: ${missing.join(', ')}`);
  }
  
  console.log('✅ Configuration Auth0 validée');
  return true;
};

// Auto-validation en développement
if (import.meta.env.DEV) {
  validateAuth0Config();
}