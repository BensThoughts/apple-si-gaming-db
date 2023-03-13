// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderArgs } from '@remix-run/server-runtime';
import prisma from '~/lib/database/db.server';
import { logger } from '~/lib/logger/logger.server';

export async function loader({ request }: LoaderArgs) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

  try {
    const url = new URL('/', `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      prisma.userProfile.count(),
      fetch(url.toString(), { method: 'HEAD' }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response('OK');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('healthcheck ❌', { error: error });
    }
    logger.error(error);
    return new Response('ERROR', { status: 500 });
  }
}
