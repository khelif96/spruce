import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, BodyProps, Disclaimer } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { LoadingButton } from "components/Buttons";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { VariantTask } from "gql/generated/types";
import { mapStringArrayToObject } from "utils/array";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
  CheckboxState,
} from "../types";
import DisabledVariantTasksList from "./DisabledVariantTasksList";
import { TaskLayoutGrid } from "./styles";
import {
  deduplicateTasks,
  getSelectAllCheckboxState,
  getVisibleAliases,
  getVisibleChildPatches,
  isCheckboxChecked,
  isCheckboxDisabled,
  isCheckboxIndeterminate,
} from "./utils";

interface Props {
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  setSelectedBuildVariantTasks: (vt: VariantTasksState) => void;
  activated: boolean;
  loading: boolean;
  previouslyActivatedVariantTasks?: VariantTask[];
  onClickSchedule: () => void;
  selectedAliases: AliasState;
  setSelectedAliases: (aliases: AliasState) => void;
  childPatches: ChildPatchAliased[];
  selectableAliases: PatchTriggerAlias[];
}

const ConfigureTasks: React.VFC<Props> = ({
  selectedBuildVariants,
  selectedBuildVariantTasks,
  setSelectedBuildVariantTasks,
  activated,
  loading,
  onClickSchedule,
  previouslyActivatedVariantTasks,
  selectedAliases,
  setSelectedAliases,
  childPatches,
  selectableAliases,
}) => {
  const aliasCount = Object.values(selectedAliases).reduce(
    (count, alias) => count + (alias ? 1 : 0),
    0
  );
  const childPatchCount = childPatches?.length || 0;
  const downstreamTaskCount = aliasCount + childPatchCount;
  const totalSelectedBuildVariantCount = Object.values(
    selectedBuildVariantTasks
  ).reduce(
    (count, tasks) =>
      count + (Object.values(tasks).some((isSelected) => isSelected) ? 1 : 0),
    0
  );

  const totalSelectedTaskCount = Object.values(
    selectedBuildVariantTasks
  ).reduce(
    (count, taskObj) => count + Object.values(taskObj).filter((v) => v).length,
    0
  );

  const currentTasks = useMemo(() => {
    const bvTasks = selectedBuildVariants.map(
      (bv) => selectedBuildVariantTasks[bv] || {}
    );
    const previouslyActivatedBVTasks = selectedBuildVariants.map((bv) =>
      mapStringArrayToObject(
        (previouslyActivatedVariantTasks || []).find((t) => t.name === bv)
          ?.tasks,
        true
      )
    );

    return deduplicateTasks(bvTasks, previouslyActivatedBVTasks);
  }, [
    selectedBuildVariantTasks,
    selectedBuildVariants,
    previouslyActivatedVariantTasks,
  ]);

  const sortedCurrentTasks = useMemo(
    () => Object.entries(currentTasks).sort((a, b) => a[0].localeCompare(b[0])),
    [currentTasks]
  );

  const currentAliases = getVisibleAliases(
    selectedAliases,
    selectedBuildVariants
  );

  /**
   * Surfaces all tasks for a given alias, If it is selected.
   */
  const viewableAliasTasks = selectableAliases.filter(({ alias }) =>
    selectedBuildVariants.includes(alias)
  );
  // Show an alias's variants/tasks if it is the only menu item selected
  const shouldShowAliasTasks =
    viewableAliasTasks.length === 1 && selectedBuildVariants.length === 1;

  const currentChildPatches = getVisibleChildPatches(
    childPatches,
    selectedBuildVariants
  );
  // Show a child patch's variants/tasks if it is the only menu item selected
  const shouldShowChildPatchTasks =
    currentChildPatches.length === 1 && selectedBuildVariants.length === 1;

  // Only show name of alias or child patch (no variants/tasks) if other build variants are also selected
  const shouldShowChildPatchesAndAliases =
    (Object.entries(currentAliases).length > 0 ||
      currentChildPatches.length > 0) &&
    selectedBuildVariants.length > 1;

  const onClickCheckbox =
    (taskName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
      const selectedAliasesCopy = { ...selectedAliases };

      selectedBuildVariants.forEach((v) => {
        if (selectedBuildVariantsCopy?.[v]?.[taskName] !== undefined) {
          selectedBuildVariantsCopy[v][taskName] = e.target.checked;
        } else if (selectedAliasesCopy?.[v] !== undefined) {
          selectedAliasesCopy[v] = e.target.checked;
        }
      });

      setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
      setSelectedAliases(selectedAliasesCopy);
    };

  const onClickSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    const selectedAliasesCopy = { ...selectedAliases };
    selectedBuildVariants.forEach((v) => {
      if (selectedBuildVariantsCopy?.[v] !== undefined) {
        Object.keys(selectedBuildVariantsCopy[v]).forEach((task) => {
          if (canEditTask(sortedCurrentTasks, task)) {
            selectedBuildVariantsCopy[v][task] = e.target.checked;
          }
        });
      } else if (selectedAliasesCopy?.[v] !== undefined) {
        selectedAliasesCopy[v] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
    setSelectedAliases(selectedAliasesCopy);
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(
    currentTasks,
    currentAliases,
    shouldShowChildPatchTasks
  );

  return (
    <TabContentWrapper>
      <Actions>
        <LoadingButton
          data-cy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={
            (totalSelectedTaskCount === 0 && aliasCount === 0) || loading
          }
          loading={loading}
        >
          Schedule
        </LoadingButton>
        <InlineCheckbox
          data-cy="select-all-checkbox"
          indeterminate={isCheckboxIndeterminate(selectAllCheckboxState)}
          onChange={onClickSelectAll}
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              Select all tasks in{" "}
              {pluralize("this", selectedBuildVariants.length)}{" "}
              {pluralize("variant", selectedBuildVariants.length)}
              {shouldShowChildPatchTasks && (
                <Tooltip
                  justify="middle"
                  triggerEvent="hover"
                  trigger={
                    <IconContainer>
                      <Icon glyph="InfoWithCircle" />
                    </IconContainer>
                  }
                >
                  Aliases specified via CLI cannot be edited.
                </Tooltip>
              )}
              {hasDisabledTasks(sortedCurrentTasks) && (
                <Tooltip
                  justify="middle"
                  triggerEvent="hover"
                  trigger={
                    <IconContainer>
                      <Icon glyph="InfoWithCircle" />
                    </IconContainer>
                  }
                >
                  Some of the tasks in{" "}
                  {pluralize("this", selectedBuildVariants.length)}{" "}
                  {pluralize("variant", selectedBuildVariants.length)} have
                  previously been activated and cannot be edited.
                </Tooltip>
              )}
            </div>
          }
          checked={selectAllCheckboxState === CheckboxState.Checked}
          disabled={
            (activated && Object.entries(currentAliases).length > 0) ||
            shouldShowChildPatchTasks
          }
        />
      </Actions>

      <StyledDisclaimer data-cy="selected-task-disclaimer">
        {totalSelectedTaskCount} {pluralize("task", totalSelectedTaskCount)}{" "}
        across {totalSelectedBuildVariantCount} build{" "}
        {pluralize("variant", totalSelectedBuildVariantCount)},{" "}
        {downstreamTaskCount} trigger {pluralize("alias", aliasCount)}
      </StyledDisclaimer>

      {/* Tasks */}
      <TaskLayoutGrid data-cy="configurePatch-tasks">
        {sortedCurrentTasks.map(([name, status]) => (
          <Checkbox
            data-cy="task-checkbox"
            key={name}
            onChange={onClickCheckbox(name)}
            label={
              <div style={{ display: "flex", flexDirection: "row" }}>
                {name}
                {isCheckboxDisabled(status) && (
                  <Tooltip
                    justify="middle"
                    triggerEvent="hover"
                    trigger={
                      <IconContainer>
                        <Icon glyph="InfoWithCircle" />
                      </IconContainer>
                    }
                  >
                    This task has previously been activated and cannot be
                    edited.
                  </Tooltip>
                )}
              </div>
            }
            indeterminate={isCheckboxIndeterminate(status)}
            checked={isCheckboxChecked(status)}
            disabled={isCheckboxDisabled(status)}
          />
        ))}
      </TaskLayoutGrid>

      {shouldShowChildPatchesAndAliases && (
        <>
          <StyledBody weight="medium">Downstream Tasks</StyledBody>
          <TaskLayoutGrid>
            {Object.entries(currentAliases).map(([name, status]) => (
              <Checkbox
                data-cy="alias-checkbox"
                key={name}
                onChange={onClickCheckbox(name)}
                label={name}
                indeterminate={isCheckboxIndeterminate(status)}
                checked={isCheckboxChecked(status)}
                disabled={activated}
              />
            ))}
            {/* Represent child patches invoked from CLI as read-only */}
            {currentChildPatches.map(({ alias }) => (
              <Checkbox
                data-cy="child-patch-checkbox"
                key={alias}
                label={alias}
                disabled
                checked
              />
            ))}
          </TaskLayoutGrid>
        </>
      )}

      {shouldShowChildPatchTasks && (
        <DisabledVariantTasksList
          data-cy="child-patch-task-checkbox"
          status={CheckboxState.Checked}
          variantTasks={currentChildPatches[0].variantsTasks}
        />
      )}

      {shouldShowAliasTasks && (
        <DisabledVariantTasksList
          data-cy="alias-task-checkbox"
          status={currentAliases[viewableAliasTasks[0].alias]}
          variantTasks={viewableAliasTasks[0].variantsTasks}
        />
      )}
    </TabContentWrapper>
  );
};

/**
 * `canEditTask` returns true if the given task is not disabled.
 * @param visibleTasks - the tasks that are visible in the UI
 * @param task - the task to check
 * @returns - true if the task is disabled, false otherwise
 */
const canEditTask = (visibleTasks: [string, CheckboxState][], task: string) =>
  !isCheckboxDisabled(visibleTasks.find(([name]) => name === task)[1]);

/**
 * `hasDisabledTasks` returns true if any of the tasks in the given list are disabled.
 * @param visibleTasks - the tasks that are visible in the UI
 * @returns - true if any of the tasks are disabled, false otherwise
 */
const hasDisabledTasks = (visibleTasks: [string, CheckboxState][]) =>
  visibleTasks.some(([, status]) => isCheckboxDisabled(status));

const Actions = styled.div`
  margin-bottom: ${size.xs};
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 40px;
  }
  & > :not(:first-of-type) {
    margin-right: ${size.m};
  }
`;

const StyledDisclaimer = styled(Disclaimer)`
  margin-bottom: ${size.xs};
`;
const cardSidePadding = css`
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;
const TabContentWrapper = styled.div`
  ${cardSidePadding}
`;

const IconContainer = styled.div`
  margin-left: ${size.xs};
  align-self: center;
  display: flex;
`;
// @ts-expect-error
const InlineCheckbox = styled(Checkbox)`
  display: inline-flex;
`;

const StyledBody = styled(Body)<BodyProps>`
  margin: ${size.xs} 0;
`;

export default ConfigureTasks;
