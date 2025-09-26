import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { UsernameMenu } from "./UserNameMenu";
import { useAuth0Login } from "@/config/auth0";

const MainNav = () => {
    const { isAuthenticated } = useAuth0();
    const login = useAuth0Login();

    return (
        <span className="flex space-x-2 items-center">
            {isAuthenticated ? (
                <>
                <UsernameMenu />
                </>
            ) : (
            <Button 
            variant="ghost"
            className="font-semibold text-xl title-clickable btn-secondary"
            onClick={() => login()}
            >
            Connexion
            </Button>
            )}
        </span>
    )
}
export { MainNav }