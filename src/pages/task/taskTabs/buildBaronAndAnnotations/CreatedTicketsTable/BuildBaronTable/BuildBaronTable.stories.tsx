import { CustomMeta, CustomStoryObj } from "test_utils/types";
import BuildBaronTable from ".";

export default {
  component: BuildBaronTable,
  title: "Pages/Task/BuildBaron/BuildBaronTable",
} satisfies CustomMeta<typeof BuildBaronTable>;

export const Default: CustomStoryObj<typeof BuildBaronTable> = {
  render: (args) => <BuildBaronTable {...args} />,
  argTypes: {},
  args: {
    jiraIssues: [
      {
        key: "EVG-123",
        fields: {
          summary: "summary",
          status: {
            name: "status",
            id: "id",
          },
          created: "2020-01-02",
          updated: "2020-01-02",
          assigneeDisplayName: "mohamed.khelif",
        },
      },
      {
        key: "EVG-124",
        fields: {
          summary: "Some other ticket",
          status: {
            name: "WAITING FOR BUG FIX",
            id: "id",
          },
          created: "2020-01-02",
          updated: "2020-01-02",
          assigneeDisplayName: "mohamed.khelif",
        },
      },
    ],
  },
};
