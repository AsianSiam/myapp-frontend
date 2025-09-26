import { useCreateMyUser } from '../api/MyUserApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * PAGE DE CALLBACK AUTH0 - ROUTE UNIQUE SÉCURISÉE
 * 
 * Cette page gère le retour utilisateur après authentification Auth0.
 * Elle synchronise l'utilisateur avec la base de données et gère les redirections.
 * 
 * 🔐 PROCESSUS SÉCURISÉ :
 * 1. Validation des données utilisateur Auth0
 * 2. Synchronisation sécurisée avec la base de données
 * 3. Redirection intelligente selon le contexte
 * 4. Gestion robuste des erreurs
 */
const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, error } = useAuth0();
    const { createUser } = useCreateMyUser();
    
    const hasCreatedUser = useRef(false);
    const [status, setStatus] = useState<'loading' | 'creating' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        console.log('🔄 AuthCallback - État:', {
            user: user?.email,
            isAuthenticated,
            isLoading,
            error: error?.message,
            hasCreatedUser: hasCreatedUser.current
        });

        // Gestion des erreurs Auth0
        if (error) {
            console.error('❌ Erreur Auth0:', error);
            setStatus('error');
            setErrorMessage('Erreur d\'authentification. Redirection...');
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        // Attendre la fin du chargement Auth0
        if (isLoading) {
            setStatus('loading');
            return;
        }

        // Vérifier l'authentification
        if (!isAuthenticated) {
            console.error('❌ Utilisateur non authentifié');
            setStatus('error');
            setErrorMessage('Authentification échouée. Redirection...');
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        // Traiter l'utilisateur authentifié
        if (user?.sub && user?.email && !hasCreatedUser.current) {
            console.log('👤 Synchronisation utilisateur...');
            setStatus('creating');
            
            createUser({ 
                auth0Id: user.sub, 
                email: user.email 
            })
            .then(() => {
                console.log('✅ Utilisateur synchronisé');
                hasCreatedUser.current = true;
                setStatus('success');
                handleRedirection();
            })
            .catch((error) => {
                console.error('❌ Erreur synchronisation:', error);
                // Continuer même en cas d'erreur (utilisateur peut déjà exister)
                hasCreatedUser.current = true;
                setStatus('success');
                setTimeout(() => handleRedirection(), 1000);
            });
        } 
        else if (isAuthenticated && !hasCreatedUser.current) {
            // Cas où l'utilisateur est authentifié mais pas encore traité
            setStatus('success');
            hasCreatedUser.current = true;
            handleRedirection();
        }
    }, [createUser, navigate, user, isAuthenticated, isLoading, error]);

    /**
     * GESTION INTELLIGENTE DES REDIRECTIONS
     */
    const handleRedirection = () => {
        // Récupération des paramètres d'URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        
        let targetUrl = '/';

        if (returnTo) {
            targetUrl = decodeURIComponent(returnTo);
            console.log('🎯 Redirection vers:', targetUrl);
        } else {
            console.log('🏠 Redirection vers accueil');
        }

        setTimeout(() => {
            navigate(targetUrl, { replace: true });
        }, 1000);
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-gray-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentification...</h2>
                            <p className="text-gray-600">Validation de vos informations</p>
                        </>
                    )}

                    {status === 'creating' && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Synchronisation...</h2>
                            <p className="text-gray-600">Configuration de votre profil</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion réussie !</h2>
                            <p className="text-gray-600">Redirection en cours...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
                            <p className="text-gray-600 mb-6">{errorMessage}</p>
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                Retour à l'accueil
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthCallbackPage;