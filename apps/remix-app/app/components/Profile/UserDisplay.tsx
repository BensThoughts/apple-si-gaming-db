// interface OwnedApp {
//     steamAppId: number;
//     name: string;
//     headerImage?: string | null;
//     platformMac?: boolean | null;
//     genres: {
//       genreId: string;
//       description: string;
//     }[];
// }

import { Form } from '@remix-run/react';
import AsideCard from '../Cards/AsideCard';
import FloatingLabelInput from '../FormComponents/SearchInput/FloatingLabelInput';
import TextArea from '../FormComponents/TextArea';
import Heading from '../Heading';
import RoundedButton from '../RoundedButton';
import OwnedApps from './OwnedApps';

interface UserDisplayProps {
  ownedApps: {
    steamAppId: number;
    name: string;
    headerImage?: string | null;
    platformMac?: boolean | null;
    genres: {
      genreId: string;
      description: string;
    }[];
  }[] | null;
}

export default function UserDisplay({
  ownedApps,
}: UserDisplayProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Heading>Systems</Heading>
        <AsideCard title="System Information" iconBackground="primary" className="max-w-md">
          This is where you can define your system information. This is the
          information that will be linked to your performance posts. You can copy
          and paste your system information directly from Steam. In Steam goto
          the help menu, select System Information, right click and select copy
          all text to clipboard. Then just paste that into the text field below.
        </AsideCard>
        <Form
          action="/profile/update-profile"
          method="post"
        >
          <FloatingLabelInput
            name="systemInfoName"
            label="System Name"
          />
          <TextArea
            name="systemInfoData"
          />
          <RoundedButton type="submit">Create</RoundedButton>
        </Form>
      </div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Heading>Library</Heading>
        {(ownedApps && ownedApps.length > 0) ? (
          <div>
            <OwnedApps ownedApps={ownedApps} />
          </div>
        ) : (
          <div>
            You are logged in but appear to have no apps owned. Is your Steam profile
            set to public?
          </div>
        )}
      </div>
    </div>
  );
}
