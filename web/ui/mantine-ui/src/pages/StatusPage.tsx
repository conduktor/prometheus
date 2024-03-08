import { Card, Group, Stack, Table, Text } from "@mantine/core";
import { useSuspenseAPIQuery } from "../api/api";
import { IconRun, IconWall } from "@tabler/icons-react";

const statusConfig: Record<
  string,
  {
    title?: string;
    formatValue?: (v: any) => string;
  }
> = {
  startTime: {
    title: "Start time",
    formatValue: (v: string) => new Date(v).toUTCString(),
  },
  CWD: { title: "Working directory" },
  reloadConfigSuccess: {
    title: "Configuration reload",
    formatValue: (v: boolean) => (v ? "Successful" : "Unsuccessful"),
  },
  lastConfigTime: {
    title: "Last successful configuration reload",
    formatValue: (v: string) => new Date(v).toUTCString(),
  },
  corruptionCount: { title: "WAL corruptions" },
  goroutineCount: { title: "Goroutines" },
  storageRetention: { title: "Storage retention" },
};

export default function StatusPage() {
  const { data: buildinfo } = useSuspenseAPIQuery<Record<string, string>>({
    path: `/status/buildinfo`,
  });
  const { data: runtimeinfo } = useSuspenseAPIQuery<Record<string, string>>({
    path: `/status/runtimeinfo`,
  });

  return (
    <Stack gap="lg" maw={1000} mx="auto" mt="lg">
      <Card shadow="xs" withBorder radius="md" p="md">
        <Group wrap="nowrap" align="center" ml="xs" mb="sm" gap="xs">
          <IconWall size={22} />
          <Text fz="xl" fw={600}>
            Build information
          </Text>
        </Group>
        <Table layout="fixed">
          <Table.Tbody>
            {Object.entries(buildinfo.data).map(([k, v]) => (
              <Table.Tr key={k}>
                <Table.Th style={{ textTransform: "capitalize" }}>{k}</Table.Th>
                <Table.Td>{v}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
      <Card shadow="xs" withBorder radius="md" p="md">
        <Group wrap="nowrap" align="center" ml="xs" mb="sm" gap="xs">
          <IconRun size={22} />
          <Text fz="xl" fw={600}>
            Runtime information
          </Text>
        </Group>
        <Table layout="fixed">
          <Table.Tbody>
            {Object.entries(runtimeinfo.data).map(([k, v]) => {
              const { title = k, formatValue = (val: string) => val } =
                statusConfig[k] || {};
              return (
                <Table.Tr key={k}>
                  <Table.Th style={{ textTransform: "capitalize" }}>
                    {title}
                  </Table.Th>
                  <Table.Td>{formatValue(v)}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}