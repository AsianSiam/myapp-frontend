import { Separator } from "@/components/ui/separator"
import { SheetDescription, SheetTitle, Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import { CircleUserRound } from "lucide-react"
import MobileNavLinks from "./MobileNavLinks"

const MobileNav = () => {
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-orange-500" />
            </SheetTrigger>
            <SheetContent className="bg-white space-y-3">
                <SheetTitle>
                    {isAuthenticated ? (
                        <span className="flex items-center font-bold gap-2">
                            <CircleUserRound className="text-orange-500"/>
                            {user?.email}
                        </span>
                    ) : (                                                
                        <span>                            
                            Welcome to MyApp
                        </span>                    
                        )
                    }                
                </SheetTitle>
                <Separator />
                <SheetDescription className="flex flex-col gap-4">
                    {!isAuthenticated ? (
                        <Button 
                        variant="ghost"
                        onClick={() => loginWithRedirect()}
                        className="flex.1 font bold bg-orange-500">
                            Login
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