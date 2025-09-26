import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { auth0Config } from "@/config/auth0";

type Props = {
  children: React.ReactNode;
};

const Auth0ProviderWithNavigate = ({ children }: Props) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    const targetUrl = appState?.returnTo || "/";
    navigate(targetUrl, { replace: true });
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.callbackUrl,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      skipRedirectCallback={false}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
