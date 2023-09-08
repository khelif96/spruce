import { useMemo, useRef } from "react";
import {
  Table,
  TableHead,
  HeaderRow,
  HeaderCell,
  TableBody,
  Row,
  Cell,
  LGColumnDef,
  useLeafyGreenTable,
  HeaderGroup,
  LeafyGreenTableRow,
  flexRender,
} from "@leafygreen-ui/table/new";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "components/styles";
import { File } from "gql/generated/types";

interface GroupedFilesTableProps {
  files: File[];
  taskName?: string;
}
const GroupedFilesTable: React.FC<GroupedFilesTableProps> = ({
  files,
  taskName,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<Array<LGColumnDef<File>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 60,
        enableSorting: true,
        cell: (value) => (
          <StyledLink href={value.row.original.link}>
            {value.getValue()}
          </StyledLink>
        ),
      },
    ],
    []
  );
  const table = useLeafyGreenTable<File>({
    containerRef: tableContainerRef,
    data: files,
    columns,
  });

  const { rows } = table.getRowModel();

  return (
    <>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      <Table ref={tableContainerRef}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<File>) => (
            <HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <HeaderCell key={header.id} header={header}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </HeaderCell>
              ))}
            </HeaderRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row: LeafyGreenTableRow<File>) => (
            <Row key={row.id} row={row}>
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GroupedFilesTable;
