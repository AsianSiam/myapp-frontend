import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useIsAdmin } from "@/api/AdminApi"
import { useAuth0Logout } from "@/config/auth0"

const MobileNavLinks = () => {
    const logout = useAuth0Logout();
    const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
    
    return (
        <>
        <Link to="/user-profile" className="flex bg-white items-center font-bold hover:text-gray-500">
            Profil Utilisateur
        </Link>
        {/* 🛡️ SÉCURITÉ : Menu admin mobile visible uniquement pour les administrateurs validés */}
        {!isLoadingAdmin && isAdmin && (
            <Link to="/manage-shop" className="flex bg-white items-center font-bold hover:text-gray-500 text-blue-600">
                🔧 Gérer ma Boutique (Admin)
            </Link>
        )}
        <Link to="/order-status" className="flex bg-white items-center font-bold hover:text-gray-500">
            Statut de la Commande
        </Link>
        <Button onClick={() => logout()} className="flex items-center px-3 font-bold bg-gray-300 hover:bg-gray-500">
            Déconnexion
        </Button> 
        </>
    )
}
export default MobileNavLinks
