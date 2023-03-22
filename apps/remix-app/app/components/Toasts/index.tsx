import { Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';
import RoundedButton from '~/components/RoundedButton';

type ToastProps = {
  message?: string,
  t: Toast,
}

function ErrorToast({ message, t }: ToastProps) {
  return (
    <Transition
      appear
      show={t.visible}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="w-full max-w-md bg-snackbar-error text-snackbar-error rounded-md
                      flex gap-4 justify-between items-center px-2 py-1">
        <span>{message}</span>
        <RoundedButton onClick={() => toast.dismiss(t.id)}>Close</RoundedButton>
      </div>
    </Transition>
  );
}

function LoginToast({ message, t }: ToastProps) {
  return (
    <Transition
      appear
      show={t.visible}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="w-full max-w-md bg-primary-highlight text-primary rounded-md
                 flex justify-between items-center px-4 py-2">
        <span>{message}</span>
        <a
          href="/api/auth/steam/login"
          className="block w-[85.5] h-[33]"
        // onClick={() => Fathom.trackGoal('7HVQUUZ4', 1)}
        >
          <img
            src="/steam_sign_in.png"
            alt="login with steam"
            width={85.5}
            height={33}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
            }}
          />
        </a>
      </div>
    </Transition>
  );
}

const errorToast = (
    message: string,
) => toast.custom(
    (t) => (<ErrorToast t={t} message={message} />),
    {
      position: 'bottom-center',
      duration: 4000,
    },
);

const loginToast = (
    message: string,
) => toast.custom(
    (t) => (<LoginToast t={t} message={message} />),
    {
      position: 'bottom-center',
      duration: 4000,
    },
);

export const showToast = {
  error: errorToast,
  login: loginToast,
};
