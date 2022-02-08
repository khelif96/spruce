import { useState } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Subtitle } from "@leafygreen-ui/typography";
import { Accordion } from "components/Accordion";
import { SpruceFormProps } from "components/SpruceForm";

const VariantInput: Record<string, string> = {
  Regex: "variant",
  Tags: "variantTags",
} as const;

const TaskInput: Record<string, string> = {
  Regex: "task",
  Tags: "taskTags",
} as const;

// Extract index of the current field via its ID
const getIndex = (id: string): number => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};

export const AliasRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  disabled,
  formData,
  idSchema,
  properties,
  readonly,
  uiSchema,
}) => {
  const [, alias, variant, variantTags, task, taskTags] = properties;
  const isDisabled = disabled || readonly;
  const accordionTitle = uiSchema["ui:accordionTitle"];

  const index = getIndex(idSchema.$id);

  const [variantInput, setVariantInput] = useState(
    formData?.variant ? VariantInput.Regex : VariantInput.Tags
  );
  const [taskInput, setTaskInput] = useState(
    formData?.task ? TaskInput.Regex : TaskInput.Tags
  );

  // Clear form when toggling between segmented control options
  const clearForm = (selectedSegment: string) => {
    switch (selectedSegment) {
      case VariantInput.Regex:
        variantTags.content.props.onChange([]);
        break;
      case VariantInput.Tags:
        variant.content.props.onChange("");
        break;
      case TaskInput.Regex:
        taskTags.content.props.onChange([]);
        break;
      case TaskInput.Tags:
        task.content.props.onChange("");
        break;
      default:
    }
  };

  const makeId = (fieldName: string): string =>
    `${idSchema.$id}-${fieldName}-field`;

  return (
    <Accordion
      title={`${accordionTitle} ${index !== null ? index + 1 : ""}`}
      defaultOpen={!isDisabled}
      titleTag={AccordionTitle}
      contents={
        <div>
          {alias.content}
          <TaskRegexContainer>
            <StyledSegmentedControl
              label="Variant"
              id="variant-input-control"
              value={variantInput}
              onChange={(value) => {
                setVariantInput(value);
                clearForm(value);
              }}
            >
              <SegmentedControlOption
                value={VariantInput.Tags}
                disabled={isDisabled}
                aria-controls={makeId(VariantInput.Tags)}
              >
                Tags
              </SegmentedControlOption>
              <SegmentedControlOption
                value={VariantInput.Regex}
                disabled={isDisabled}
                aria-controls={makeId(VariantInput.Regex)}
              >
                Regex
              </SegmentedControlOption>
            </StyledSegmentedControl>
            {variantInput === VariantInput.Tags ? (
              <div data-cy="variant-tags-field" id={makeId(VariantInput.Tags)}>
                {variantTags.content}
              </div>
            ) : (
              <div data-cy="variant-field" id={makeId(VariantInput.Regex)}>
                {variant.content}
              </div>
            )}
          </TaskRegexContainer>
          <TaskRegexContainer>
            <StyledSegmentedControl
              label="Task"
              id="task-input-control"
              value={taskInput}
              onChange={(value) => {
                setTaskInput(value);
                clearForm(value);
              }}
            >
              <SegmentedControlOption
                value={TaskInput.Tags}
                disabled={isDisabled}
                aria-controls={makeId(TaskInput.Tags)}
              >
                Tags
              </SegmentedControlOption>
              <SegmentedControlOption
                value={TaskInput.Regex}
                disabled={isDisabled}
                aria-controls={makeId(TaskInput.Regex)}
              >
                Regex
              </SegmentedControlOption>
            </StyledSegmentedControl>
            {taskInput === TaskInput.Tags ? (
              <div data-cy="task-tags-field" id={makeId(TaskInput.Tags)}>
                {taskTags.content}
              </div>
            ) : (
              <div data-cy="task-field" id={makeId(TaskInput.Regex)}>
                {task.content}
              </div>
            )}
          </TaskRegexContainer>
        </div>
      }
    />
  );
};

/* @ts-expect-error  */
const AccordionTitle = styled(Subtitle)`
  font-size: 16px;
  margin: 8px 0;
`;

const TaskRegexContainer = styled.div`
  margin-bottom: 32px;
  margin-top: 12px;
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-bottom: 12px;
`;