import {
  createCookie,
} from '@remix-run/node';

export const loginCookie = createCookie('sign-in', {
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
});
