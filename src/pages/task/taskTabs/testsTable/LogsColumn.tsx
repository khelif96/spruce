import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import { getTaskHistoryRoute } from "constants/routes";
import { TestResult } from "gql/generated/types";
import { TestStatus } from "types/test";
import { isBeta } from "utils/environmentalVariables";

interface Props {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
    | { name: "Click See History Button" }
  >;
  testResult: TestResult;
  task: {
    name: string;
    projectIdentifier: string;
  };
}

export const LogsColumn: React.FC<Props> = ({
  testResult,
  taskAnalytics,
  task,
}) => {
  const { status, testFile } = testResult;
  const { url: urlHTML, urlRaw, urlLobster } = testResult.logs ?? {};
  const { projectIdentifier, name } = task ?? {};

  let filters;
  if (status === TestStatus.Fail) {
    filters = {
      failingTests: [testFile],
    };
  }
  return (
    <ButtonWrapper>
      {urlLobster && (
        <Button
          data-cy="test-table-lobster-btn"
          size="xsmall"
          target="_blank"
          variant="default"
          href={urlLobster}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Click Logs Lobster Button",
            })
          }
        >
          Lobster
        </Button>
      )}
      {urlHTML && (
        <Button
          data-cy="test-table-html-btn"
          size="xsmall"
          target="_blank"
          variant="default"
          href={urlHTML}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Click Logs HTML Button",
            })
          }
        >
          HTML
        </Button>
      )}
      {urlRaw && (
        <Button
          data-cy="test-table-raw-btn"
          size="xsmall"
          target="_blank"
          variant="default"
          href={urlRaw}
          onClick={() =>
            taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
          }
        >
          Raw
        </Button>
      )}
      {isBeta() && filters && (
        <Button
          size="xsmall"
          as={Link}
          data-cy="task-history"
          key="task-history"
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Click See History Button" });
          }}
          to={getTaskHistoryRoute(projectIdentifier, name, filters)}
        >
          History
        </Button>
      )}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  > * {
    margin-right: 8px;
    margin-top: 8px;
  }
`;