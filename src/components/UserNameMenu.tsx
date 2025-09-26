import { DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuSeparator,  DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useIsAdmin } from "@/api/AdminApi"
import { useAuth0Logout } from "@/config/auth0"

const UsernameMenu = () => {
    const logout = useAuth0Logout();
    const { isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center p-2 text-app-primary hover:text-accent transition-colors rounded-lg">
                <CircleUserRound className="h-6 w-6" />                
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dropdown-menu w-80" align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/user-profile" className="font-bold title-clickable">
                    Profil Utilisateur
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="/order-status" className="font-bold title-clickable">
                    Mes Commandes
                </Link>
                </DropdownMenuItem>
                {/* 🛡️ SÉCURITÉ : Menu admin visible uniquement pour les administrateurs validés */}
                {!isLoadingAdmin && isAdmin && (
                    <DropdownMenuItem>
                        <Link to="/manage-shop" className="font-bold title-clickable text-accent">
                        🔧 Gérer ma Boutique (Admin)
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />                
                <DropdownMenuItem>
                    <Button 
                        onClick={() => logout()} 
                        className="flex flex-1 font-bold btn-secondary"
                    >
                        Déconnexion
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export { UsernameMenu }