import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { IconTrash } from "@/components/ui/icons";
import { Table, Td, Th } from "@/components/ui/table";

export interface RecordColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

export function RecordTable<T extends { id: number }>({
  columns,
  rows,
  onDelete,
}: {
  columns: RecordColumn<T>[];
  rows: T[];
  onDelete?: (id: number) => void;
}) {
  if (rows.length === 0) return <EmptyState message="No records yet." />;

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <Th key={column.header}>{column.header}</Th>
          ))}
          {onDelete && <Th className="text-right">Actions</Th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <Td key={column.header}>{column.render(row)}</Td>
            ))}
            {onDelete && (
              <Td className="text-right">
                <Button variant="danger" size="sm" onClick={() => onDelete(row.id)}>
                  <IconTrash className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </Td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
