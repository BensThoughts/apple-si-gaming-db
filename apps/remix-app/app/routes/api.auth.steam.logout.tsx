import { redirect } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';

/**
 *  This route should never actually be routed to because the express
 *  app in server.ts includes it as a route for passport. For some reason
 *  however remix tries to route here after the redirect() in /actions/logout.
 *  The loader isn't called but the route is shown.
 *  /api/auth/steam/login and /api/auth/steam/return are also handles in server.ts
 */

export async function loader({ context }: LoaderArgs) {
  return redirect('/logged-out');
}

export default function SteamLogoutRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/logged-out');
  }, [navigate]);

  return null;
}
