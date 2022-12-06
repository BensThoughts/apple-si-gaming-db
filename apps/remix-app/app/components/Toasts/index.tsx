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
      className="w-full max-w-md bg-error text-color-snackbar-error rounded-md
                 flex justify-between items-center px-4 py-2"
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 translate-y-6"
      enterTo="opacity-100 translate-y-0"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <span>{message}</span>
      <RoundedButton onClick={() => toast.dismiss(t.id)}>Close</RoundedButton>
    </Transition>
  );
}

export const errorToast = (
    message: string,
) => toast.custom(
    (t) => (<ErrorToast t={t} message={message} />),
    {
      position: 'bottom-center',
      duration: 4000,
    },
);

export const showToast = {
  error: errorToast,
};
