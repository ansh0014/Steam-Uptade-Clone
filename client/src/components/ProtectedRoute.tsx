import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route, RouteComponentProps } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin w-8 h-8 border-4 border-steam-blue border-t-transparent rounded-full" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}