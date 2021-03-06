import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { useSpawnAnalytics } from "analytics";
import { HostStatusBadge } from "components/HostStatusBadge";
import { DoesNotExpire, SpawnTable } from "components/Spawn";
import { WordBreak } from "components/Typography";
import { MyHost } from "types/spawn";
import { parseQueryString } from "utils";
import { sortFunctionDate, sortFunctionString } from "utils/string";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

interface SpawnHostTableProps {
  hosts: MyHost[];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();
  const host = parseQueryString(search)?.host;
  const spawnAnalytics = useSpawnAnalytics();
  return (
    <SpawnTable
      columns={columns}
      dataSource={hosts}
      expandable={{
        expandedRowRender: (record: MyHost) => <SpawnHostCard host={record} />,
        onExpand: (expanded) => {
          spawnAnalytics.sendEvent({
            name: "Toggle Spawn Host Details",
            expanded,
          });
        },
      }}
      defaultExpandedRowKeys={[host as string]}
    />
  );
};

const columns = [
  {
    title: "Host",
    dataIndex: "id",
    key: "host",
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "id"),
    render: (_, host: MyHost) =>
      host?.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <WordBreak>{host.displayName || host.id}</WordBreak>
          <WorkstationBadge>WORKSTATION</WorkstationBadge>
        </FlexContainer>
      ) : (
        <WordBreak>{host.displayName || host.id}</WordBreak>
      ),
  },
  {
    title: "Distro",
    dataIndex: "distro",
    key: "distro",
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "distro.id"),
    render: (distro) => <WordBreak>{distro.id}</WordBreak>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "status"),
    render: (status) => <HostStatusBadge status={status} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    key: "expiration",
    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, host: MyHost) =>
      host?.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Uptime",
    dataIndex: "uptime",
    key: "uptime",

    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "uptime"),
    render: (uptime) => formatDistanceToNow(new Date(uptime)),
  },
  {
    title: "Action",
    key: "action",
    render: (_, host: MyHost) => <SpawnHostTableActions host={host} />,
  },
];

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WorkstationBadge = styled(Badge)`
  margin-left: 5px;
`;
