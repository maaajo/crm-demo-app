import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Icon,
} from "@chakra-ui/react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
};

export function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const [shouldSort, setShouldSort] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setShouldSort,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: shouldSort,
    },
    debugTable: true,
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id} backgroundColor={"blackAlpha.100"}>
            {headerGroup.headers.map((header) => {
              const canSortColumn = header.column.getCanSort();
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={header.column.columnDef.meta?.isNumeric}
                  textTransform={"none"}
                  fontSize={"lg"}
                  fontWeight={"bold"}
                  color={"blackAlpha.800"}
                  py={6}
                  letterSpacing={"tight"}
                  cursor={`${canSortColumn ? "pointer" : null}`}
                >
                  <chakra.span display={"flex"} alignItems={"center"}>
                    <chakra.span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </chakra.span>

                    {canSortColumn ? (
                      <chakra.span pl="4">
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
                            <Icon as={ChevronDownIcon} boxSize={4} />
                          ) : (
                            <Icon as={ChevronUpIcon} boxSize={4} />
                          )
                        ) : (
                          <Icon as={ChevronsUpDown} boxSize={4} />
                        )}
                      </chakra.span>
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row, rowIndex, rowArray) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td
                key={cell.id}
                isNumeric={cell.column.columnDef.meta?.isNumeric}
                fontSize={"md"}
                borderBottomColor={`${
                  rowIndex !== rowArray.length - 1 ? "blackAlpha.200" : null
                }`}
                py={6}
                color={"blackAlpha.800"}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
