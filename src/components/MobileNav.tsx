import { Separator } from "@/components/ui/separator"
import { SheetDescription, Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import { CircleUserRound } from "lucide-react"
import MobileNavLinks from "./MobileNavLinks"
import { useGetMyUser } from "@/api/MyUserApi"

const MobileNav = () => {
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    const { currentUser } = useGetMyUser();
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-black hover:text-gray-500" />
            </SheetTrigger>
            <SheetContent className="bg-white space-y-3">                
                <Separator />
                <SheetDescription className="text-sm text-black">
                    {isAuthenticated ? (
                        <span className="flex items-center font-bold gap-2">
                           <CircleUserRound className="text-black h-6 w-6 hover:text-slate-500" />
                           {currentUser?.nickname ? currentUser.nickname : user?.email}
                        </span>
                    ) : (
                        <span className="flex items-center font-bold gap-2">
                            Welcome to MyApp
                        </span>
                    )}
                </SheetDescription>
                <Separator />                
                <SheetDescription className="flex flex-col">
                    {!isAuthenticated ? (
                        <Button 
                        variant="ghost"
                        onClick={() => loginWithRedirect()}
                        className="flex w-full items-center font-bold bg-slate-400 hover:bg-gray-300">
                            Connexion
                        </Button>
                    ) : (
                        <MobileNavLinks />                    
                    )}
                </SheetDescription>            
            </SheetContent>     
        </Sheet>
    )
}
export { MobileNav} 