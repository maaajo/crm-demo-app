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
  IconButton,
} from "@chakra-ui/react";
import {
  ColumnDef,
  SortingState,
  Table as ReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  isSelectable?: boolean;
  rowSelectionState?: {};
  onSelectChangeHandler?: Dispatch<SetStateAction<any>>;
  showPagination?: boolean;
};

type PaginationProps<Data extends object> = {
  table: ReactTable<Data>;
};

function Pagination<Data extends object>({ table }: PaginationProps<Data>) {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      px={2}
      py={6}
      fontSize={"sm"}
    >
      <Box color={"blackAlpha.600"}>
        {`${table.getFilteredSelectedRowModel().rows.length} of ${
          table.getFilteredRowModel().rows.length
        } row(s) selected.`}
      </Box>
      <HStack alignItems={"center"} spacing={6}>
        <HStack alignItems={"center"} spacing={2}>
          <Text whiteSpace={"nowrap"} fontWeight={"medium"}>
            Rows per page:
          </Text>
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
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          fontSize={"sm"}
          fontWeight={"medium"}
        >
          {`Page ${
            table.getState().pagination.pageIndex + 1
          } of ${table.getPageCount()}`}
        </Flex>
        <HStack alignItems={"center"} spacing={2}>
          <IconButton
            icon={<Icon as={ChevronsLeft} />}
            aria-label="Go to first page"
            variant={"solid"}
            isDisabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          />
          <IconButton
            icon={<Icon as={ChevronLeft} />}
            aria-label="Go to previous page"
            variant={"solid"}
            isDisabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
          <IconButton
            icon={<Icon as={ChevronRight} />}
            aria-label="Go to next page"
            variant={"solid"}
            isDisabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          />
          <IconButton
            icon={<Icon as={ChevronsRight} />}
            aria-label="Go to last page"
            variant={"solid"}
            isDisabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          />
        </HStack>
      </HStack>
    </Flex>
  );
}

export function DataTable<Data extends object>({
  data,
  columns,
  isSelectable,
  rowSelectionState,
  onSelectChangeHandler,
  showPagination,
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
      {showPagination ? <Pagination table={table} /> : null}
    </>
  );
}
