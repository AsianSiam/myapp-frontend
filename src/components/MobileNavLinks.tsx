import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

const MobileNavLinks = () => {
    const { logout } = useAuth0();
    return (
        <>
        <Link to="/user-profile" className="flex bg-white items-center font-bold hover:text-gray-500">
            Profil Utilisateur
        </Link>
        <Link to="/manage-shop" className="flex bg-white items-center font-bold hover:text-gray-500">
            Gérer ma Boutique
        </Link>
        <Link to="/order-status" className="flex bg-white items-center font-bold hover:text-gray-500">
            Statut de la Commande
        </Link>
        <Button onClick={() => logout ()}  className="flex items-center px-3 font-bold bg-gray-300 hover:bg-gray-500">
            Déconnexion
        </Button> 
        </>
    )
}
export default MobileNavLinks
