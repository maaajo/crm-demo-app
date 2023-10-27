import { routes } from "@/lib/routes";
import { Countries } from "@/lib/static/countries";
import { TAccountSupabase } from "@/lib/types/account";
import { Link } from "@chakra-ui/next-js";
import {
  Checkbox,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { CellContext, Row, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import startCase from "lodash.startcase";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";

const columnHelper = createColumnHelper<TAccountSupabase>();

const getURLSearchParams = (row: Row<TAccountSupabase>) => {
  const editURLSearchParams = new URLSearchParams();

  const dataKeysFiltered = Object.keys(row.original).filter(
    (item) => item !== "id"
  );

  for (let objectKey of dataKeysFiltered) {
    const currentValue = row.original[objectKey as keyof typeof row.original];
    if (currentValue) {
      editURLSearchParams.append(objectKey, currentValue.toString());
    } else {
      editURLSearchParams.append(objectKey, "");
    }
  }

  return editURLSearchParams;
};

{
  /* <IconButton
          aria-label="Edit current account"
          as={Link}
          href={`${routes.accounts.edit}/${
            row.original.id
          }?${getURLSearchParams(row).toString()}`}
          icon={<Icon as={Pencil} boxSize={{ base: 5, "2xl": 6 }} />}
          variant={"unstyled"}
        /> */
}

export const accountsTableColumns = [
  columnHelper.accessor("id", {
    header: ({ table }) => {
      return (
        <Checkbox
          colorScheme="blackAlpha"
          variant={"black"}
          isChecked={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          colorScheme="blackAlpha"
          isChecked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          isIndeterminate={row.getIsSomeSelected()}
          variant={"black"}
        />
      );
    },
    enableSorting: false,
    id: "checkbox",
  }),
  columnHelper.accessor("name", {
    cell: ({ cell }) => {
      return cell.getValue();
    },
    header: "Name",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("is_active", {
    cell: ({ cell }) => startCase(String(cell.getValue())),
    header: "Active",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("status", {
    cell: ({ cell }) => startCase(cell.getValue()),
    header: "Status",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("source", {
    cell: ({ cell }) => cell.getValue(),
    header: "Source",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("currency", {
    cell: ({ cell }) => cell.getValue(),
    header: "Currency",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("country", {
    cell: ({ cell }) => {
      const countryData = Countries.filter(
        (country) => country.code === cell.getValue()
      )[0];
      return `${countryData.flag} ${countryData.name}`;
    },
    header: "Country",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("city", {
    cell: ({ cell }) => startCase(cell.getValue()),
    header: "City",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("created_at", {
    cell: ({ cell }) => dayjs(cell.getValue()).format("DD/MM/YYYY HH:mm"),
    header: "Created at",
    sortingFn: "datetime",
  }),
  {
    cell: ({ row }: CellContext<TAccountSupabase, unknown>) => {
      const urlParams = getURLSearchParams(row);
      return (
        <Menu isLazy={true}>
          <MenuButton
            as={IconButton}
            aria-label="Account options"
            icon={<MoreHorizontal />}
            variant={"unstyled"}
          />
          <MenuList minW="0" w={"150px"} fontSize={"sm"}>
            <MenuItem
              py={2}
              as={Link}
              href={`${routes.accounts.edit}/${
                row.original.id
              }?${urlParams.toString()}`}
              icon={<Icon as={Pencil} boxSize={{ base: 5, "2xl": 6 }} />}
              _hover={{ textDecoration: "none" }}
            >
              Edit
            </MenuItem>
            <MenuItem
              py={2}
              as={Link}
              href={`${routes.accounts.details}/${
                row.original.id
              }?${urlParams.toString()}`}
              icon={<Icon as={Eye} boxSize={{ base: 5, "2xl": 6 }} />}
              _hover={{ textDecoration: "none" }}
            >
              View
            </MenuItem>
          </MenuList>
        </Menu>
      );
    },
    enableSorting: false,
    header: "",
    id: "edit",
  },
];
