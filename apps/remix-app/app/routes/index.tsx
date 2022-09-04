import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import prisma from '~/lib/database/db.server';

export async function loader({ request }: LoaderArgs) {
  const games = await prisma.steamApp.findMany({
    where: {
      name: {
        contains: 'portal',
        mode: 'insensitive',
      },
    },
    select: {
      name: true,
      steamAppId: true,
    },
  });
  return json({ games });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix With Express</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
