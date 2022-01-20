import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { TaskStatusIcon } from "components/TaskStatusIcon";

interface TaskStatusCheckboxProps {
  displayName: string;
  status: string;
  taskId: string;
  checked: boolean;
  baseStatus?: string;
  style: React.CSSProperties; // passed in by react-window to handle list virtualization
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  taskId,
  status,
  baseStatus,
  displayName,
  checked,
  style,
}) => (
  <Checkbox
    style={style}
    data-cy="task-status-checkbox"
    className="task-checkbox"
    name={taskId}
    label={
      <StateItemWrapper>
        <StyledTaskStatusIcon status={status} />
        {baseStatus ? (
          <StyledTaskStatusIcon status={baseStatus} />
        ) : (
          <EmptyCell />
        )}
        <div>{displayName}</div>
      </StateItemWrapper>
    }
    checked={checked}
    bold={false}
  />
);

export const TaskStatusCheckbox = React.memo(CheckboxComponent);

const StateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
`;

const StyledTaskStatusIcon = styled(TaskStatusIcon)`
  margin-right: 3px;
`;

// Wrapping checkboxes with fix width container
// adjusts alignment.
const EmptyCell = styled.span`
  width: 19px;
`;