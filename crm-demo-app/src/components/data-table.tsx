import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Icon,
  Flex,
  Box,
  HStack,
  Text,
  Select,
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
import { Dispatch, SetStateAction, useState } from "react";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  isSelectable?: boolean;
  rowSelectionState?: {};
  onSelectChangeHandler?: Dispatch<SetStateAction<any>>;
};

export function DataTable<Data extends object>({
  data,
  columns,
  isSelectable,
  rowSelectionState,
  onSelectChangeHandler,
}: DataTableProps<Data>) {
  const [shouldSort, setShouldSort] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setShouldSort,
    getSortedRowModel: getSortedRowModel(),
    ...(isSelectable
      ? {
          enableRowSelection: true,
          onRowSelectionChange: onSelectChangeHandler,
        }
      : {}),
    state: {
      sorting: shouldSort,
      ...(isSelectable
        ? {
            rowSelection: rowSelectionState,
          }
        : {}),
    },
  });

  return (
    <>
      <Table size={{ base: "sm" }}>
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
                    fontSize={{ base: "md", "2xl": "lg" }}
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
                  fontSize={{ base: "sm", "2xl": "md" }}
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
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        px={2}
        py={6}
        fontSize={"sm"}
      >
        <Box flex={1} color={"blackAlpha.600"}>
          {`${table.getFilteredSelectedRowModel().rows.length} of ${
            table.getFilteredRowModel().rows.length
          } row(s) selected.`}
        </Box>
        <HStack flex={1} alignItems={"center"} spacing={6}>
          <HStack alignItems={"center"} spacing={2} justifyContent={"flex-end"}>
            <Text fontWeight={"medium"}>Rows per page:</Text>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => table.setPageSize(parseInt(e.target.value))}
              size={"sm"}
            >
              {[10, 20, 30].map((pageSize) => (
                <chakra.option value={`${pageSize}`} key={pageSize}>
                  {pageSize}
                </chakra.option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </Flex>
    </>
  );
}
