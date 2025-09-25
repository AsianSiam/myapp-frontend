import { DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuSeparator,  DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth0 } from "@auth0/auth0-react"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

const UsernameMenu = () => {
    const { logout } = useAuth0();    
    return (

        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center ps-x font-bold hover:text-gray-500 gap-2">
                <CircleUserRound className="text-black h-6 w-6 hover:text-slate-500" />                
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white border border-gray-200" align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/user-profile" className="font-bold hover:text-gray-500">
                    Profil Utilisateur
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="/order-status" className="font-bold hover:text-gray-500">
                    Mes Commandes
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="/manage-shop" className="font-bold hover:text-gray-500">
                    Gérer ma Boutique
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />                
                <DropdownMenuItem>
                    <Button 
                        onClick={() => logout ()} 
                        className="flex flex-1 font-bold bg-gray-300 hover:text-gray-500 hover:bg-white"
                    >
                        Déconnexion
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export { UsernameMenu }