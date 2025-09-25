import { useCreateMyUser } from '../api/MyUserApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef } from 'react';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { createUser } = useCreateMyUser();

    const hasCreatedUser = useRef(false);

    useEffect(() => {
        console.log('🔄 AuthCallback - État:', {
            user: user?.email,
            isAuthenticated,
            isLoading,
            hasCreatedUser: hasCreatedUser.current
        });

        if (user?.sub && user?.email && !hasCreatedUser.current && isAuthenticated) {
            console.log('👤 Création/Mise à jour utilisateur');
            createUser({ auth0Id: user.sub, email: user.email});
            hasCreatedUser.current = true;
            
            // Attendre un peu avant de rediriger pour laisser le temps à la création de l'utilisateur
            setTimeout(() => {
                // Vérifier s'il y a des paramètres de redirection
                const returnTo = searchParams.get('returnTo');
                const targetUrl = returnTo || '/';
                
                console.log('🎯 Redirection après authentification vers:', targetUrl);
                navigate(targetUrl);
            }, 1000);
        } else if (!isLoading && isAuthenticated && hasCreatedUser.current) {
            // Utilisateur déjà créé, redirection immédiate
            const returnTo = searchParams.get('returnTo');
            const targetUrl = returnTo || '/';
            
            console.log('🎯 Redirection immédiate vers:', targetUrl);
            navigate(targetUrl);
        }
    }, [createUser, navigate, user, isAuthenticated, isLoading, searchParams]);
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Finalisation de la connexion...</p>
            </div>
        </div>
    );
}

export default AuthCallbackPage;