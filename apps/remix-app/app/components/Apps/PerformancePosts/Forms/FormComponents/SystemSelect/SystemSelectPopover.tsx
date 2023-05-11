import TailwindPopover from '~/components/HeadlessComponents/TailwindPopover';
import { HardDriveIcon } from '~/components/Icons/FeatherIcons';
import RemixUnderlineLink from '~/components/RemixUnderlineLink';
import type { SystemSpecSelectOption } from '../SystemSelectMenuCard/SystemSelectMenu';
import SelectMenu from '~/components/FormComponents/SelectMenu';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import { initialSystemSpecOption } from '../../FormContext/initialFormOptions';

export default function SystemSelectPopover({
  systemSpecOptions,
}: {
  systemSpecOptions: SystemSpecSelectOption[];
}) {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: SystemSpecSelectOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_SYSTEM_SPEC_OPTION,
      payload: selection,
    });
  }

  return (
    <TailwindPopover
      buttonText="System"
      Icon={HardDriveIcon}
    >
      <div className="flex flex-col gap-2 p-3 items-center w-full max-w-sm">
        <div className="text-primary-faded">
          You can create, and then select, a system from your&nbsp;
          <RemixUnderlineLink to="/profile/systems">
            profile
          </RemixUnderlineLink>
          &nbsp;to attach system information to your post.
        </div>
        <SelectMenu
          value={state.systemSpecSelectedOption}
          options={[initialSystemSpecOption, ...systemSpecOptions]}
          labelText="System"
          showLabel={false}
          outlineStyle
          onChange={onSelectionChange}
        />
      </div>
    </TailwindPopover>
  );
}
