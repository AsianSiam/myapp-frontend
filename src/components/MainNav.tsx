import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { UsernameMenu } from "./UserNameMenu";

const MainNav = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <span className="flex space-x-2 items-center">
            {isAuthenticated ? (
                <>
                <UsernameMenu />
                </>
            ) : (
            <Button 
            variant="ghost"
            className="font-semibold text-xl hover:text-slate-500 bg-white"
            onClick={() => loginWithRedirect()}
            >
            Connexion
            </Button>
            )}
        </span>
    )
}
export { MainNav }