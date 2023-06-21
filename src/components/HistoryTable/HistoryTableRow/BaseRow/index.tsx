import CommitChartLabel from "components/CommitChartLabel";
import { types } from "../..";
import { LabelCellContainer } from "../../Cell";
import { useHistoryTable } from "../../HistoryTableContext";
import { rowType } from "../../types";
import DateSeparator from "./DateSeparator";
import FoldedCommit from "./FoldedCommit";
import { RowContainer } from "./styles";

type BaseRowEventHandlers = {
  onClickGithash: () => void;
  onClickFoldedGithash: () => void;
  onClickUpstreamProject: () => void;
  onClickFoldedUpstreamProject: () => void;
  onClickJiraTicket: () => void;
  onClickFoldedJiraTicket: () => void;
  onToggleFoldedCommit: (s: { isVisible: boolean }) => void;
};
interface RowProps {
  columns: React.ReactNode[];
  data: types.CommitRowType;
  index: number;
  numVisibleCols: number;
  eventHandlers: BaseRowEventHandlers;
  selected: boolean;
}

const BaseRow: React.VFC<RowProps> = ({
  columns,
  data,
  index,
  numVisibleCols,
  eventHandlers,
  selected,
}) => {
  const {
    onClickFoldedGithash,
    onClickFoldedJiraTicket,
    onClickFoldedUpstreamProject,
    onClickGithash,
    onClickJiraTicket,
    onClickUpstreamProject,
    onToggleFoldedCommit,
  } = eventHandlers;
  const { columnLimit, toggleRowExpansion } = useHistoryTable();

  switch (data.type) {
    case rowType.DATE_SEPARATOR:
      return <DateSeparator date={data.date} />;
    case rowType.COMMIT: {
      const {
        revision,
        createTime,
        author,
        message,
        id: versionId,
        upstreamProject,
      } = data.commit;

      return (
        <RowContainer data-selected={selected} selected={selected}>
          <LabelCellContainer>
            <CommitChartLabel
              versionId={versionId}
              githash={revision}
              createTime={createTime}
              author={author}
              message={message}
              onClickGithash={onClickGithash}
              onClickJiraTicket={onClickJiraTicket}
              upstreamProject={upstreamProject}
              onClickUpstreamProject={onClickUpstreamProject}
            />
          </LabelCellContainer>
          {columns}
        </RowContainer>
      );
    }
    case rowType.FOLDED_COMMITS:
      return (
        <FoldedCommit
          index={index}
          data={data}
          selected={selected}
          numVisibleCols={numVisibleCols || columnLimit}
          onClickGithash={onClickFoldedGithash}
          onClickJiraTicket={onClickFoldedJiraTicket}
          onToggleFoldedCommit={({ expanded, index: rowIndex }) => {
            onToggleFoldedCommit({ isVisible: expanded });
            toggleRowExpansion(rowIndex, expanded);
          }}
          onClickUpstreamProject={onClickFoldedUpstreamProject}
        />
      );
    default:
      return null;
  }
};

export default BaseRow;