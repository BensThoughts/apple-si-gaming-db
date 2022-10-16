import type {
  CreateSystemSpecActionData,
  DeleteSystemSpecActionData,
  EditSystemSpecActionData,
} from '~/routes/profile';
import LibraryLayout from './Library/LibraryLayout';
import LoginLayout from './Login/LoginLayout';
import SystemSpecLayout from './Systems/SystemSpecLayout';
interface UserDisplayProps {
  isLoggedIn: boolean;
  avatarFull?: string | null;
  displayName?: string | null;
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
    genres: {
      genreId: string;
      description: string;
    }[];
    platformMac?: boolean | null;
  }[];
  isSubmittingUpdateGames: boolean;
  systemSpecs: {
    systemName: string;
    manufacturer: string | null;
    model: string | null;
    cpuBrand: string | null;
    osVersion: string | null;
    videoDriver: string | null;
    videoDriverVersion: string | null;
    videoPrimaryVRAM: string | null;
    memoryRAM: string | null;
  }[],
  createSystemSpecActionData?: CreateSystemSpecActionData;
  isSubmittingCreateSystemForm: boolean;
  editSystemSpecActionData?: EditSystemSpecActionData;
  deleteSystemSpecActionData?: DeleteSystemSpecActionData;
}


export default function UserDisplay({
  isLoggedIn,
  avatarFull,
  displayName,
  ownedApps,
  systemSpecs,
  createSystemSpecActionData,
  isSubmittingCreateSystemForm,
  editSystemSpecActionData,
  deleteSystemSpecActionData,
  isSubmittingUpdateGames,
}: UserDisplayProps) {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <LoginLayout
        isLoggedIn={isLoggedIn}
        avatarFull={avatarFull}
        displayName={displayName}
      />
      {isLoggedIn && (
        <>
          <SystemSpecLayout
            systemSpecs={systemSpecs}
            isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
            createSystemSpecActionData={createSystemSpecActionData}
            editSystemSpecActionData={editSystemSpecActionData}
            deleteSystemSpecActionData={deleteSystemSpecActionData}
          />
          <LibraryLayout
            ownedApps={ownedApps}
            isSubmittingUpdateGames={isSubmittingUpdateGames}
          />
        </>
      )}
    </div>
  );
}
