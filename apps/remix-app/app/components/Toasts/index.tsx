import toast from 'react-hot-toast';
import RoundedButton from '~/components/RoundedButton';

export const errorToast = (
    message: string,
) => toast.custom(
    (t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'}
                      w-full max-w-sm bg-color-error rounded-md flex
                      justify-between items-center px-4 py-2`}
      >
        <span>{message}</span>
        <RoundedButton onClick={() => toast.dismiss(t.id)}>Close</RoundedButton>
      </div>
    ), {
      position: 'bottom-center',
      duration: 4000,
    });
