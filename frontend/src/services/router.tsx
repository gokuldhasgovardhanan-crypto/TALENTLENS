import React, { createContext, useContext, useState, useEffect } from 'react';

interface Location {
  pathname: string;
  state?: any;
}

interface RouterContextType {
  location: Location;
  navigate: (to: string, options?: { state?: any; replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>({
    pathname: window.location.pathname || '/',
    state: window.history.state,
  });

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setLocation({
        pathname: window.location.pathname || '/',
        state: event.state,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { state?: any; replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(options?.state || null, '', to);
    } else {
      window.history.pushState(options?.state || null, '', to);
    }
    setLocation({
      pathname: to,
      state: options?.state,
    });
  };

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useLocation = (): Location => {
  const context = useContext(RouterContext);
  if (!context) {
    return { pathname: window.location.pathname || '/' };
  }
  return context.location;
};

export const useNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) {
    return (to: string) => {
      window.location.pathname = to;
    };
  }
  return context.navigate;
};

export const Link: React.FC<{ to: string; className?: string; children: React.ReactNode; title?: string }> = ({
  to,
  className,
  children,
  title,
}) => {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      title={title}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export const Navigate: React.FC<{ to: string; state?: any; replace?: boolean }> = ({ to, state, replace }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { state, replace });
  }, [to, state, replace, navigate]);
  return null;
};

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = () => null;

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  let matchedElement: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!matchedElement && React.isValidElement<RouteProps>(child)) {
      const { path, element } = child.props;
      if (path === '*' || path === pathname) {
        matchedElement = element;
      } else if (path.endsWith('/*')) {
        const basePath = path.replace('/*', '');
        if (pathname.startsWith(basePath)) {
          matchedElement = element;
        }
      }
    }
  });

  return <>{matchedElement}</>;
};
