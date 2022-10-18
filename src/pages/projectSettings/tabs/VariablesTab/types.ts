import { ProjectType } from "../utils";

export interface FormState {
  vars: Array<{
    varName: string;
    varValue: string;
    isPrivate: boolean;
    isAdminOnly: boolean;
    isDisabled: boolean;
  }>;
}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
