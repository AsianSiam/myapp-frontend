import { DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuSeparator,  DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth0 } from "@auth0/auth0-react"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

const UsernameMenu = () => {
    const { user, logout } = useAuth0();
    return (

        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center ps-x font-bold hover:text-orange-500 gap-2">
                <CircleUserRound className="text-orange-500" />
                {user?.email}                
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/user-profile" className="font-bold hover:text-orange-500">
                    User Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to="/manage-restaurant" className="font-bold hover:text-orange-500">
                    Manage Restaurant
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />                
                <DropdownMenuItem>
                    <Button 
                        onClick={() => logout ()} 
                        className="flex flex-1 font-bold bg-orange-500"
                    >
                            Log Out                        
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export { UsernameMenu }