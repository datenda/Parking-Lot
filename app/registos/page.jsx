"use client";

import { useAsyncList } from "@react-stately/data";
import React, { useEffect, useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Tooltip,
  Pagination,
  Input,
  DateRangePicker,
} from "@nextui-org/react";

export default function RegistosPage() {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const columns = [
    { name: "Ação", uid: "acao" },
    { name: "Colaborador", uid: "user_id" },
    { name: "Galera", uid: "galera" },
    { name: "Móvel", uid: "movel" },
    { name: "Descrição", uid: "descricao" },
    { name: "Hora Criada", uid: "timestamp" },
  ];

  let list = useAsyncList({
    async load({ signal }) {
      try {
        // Default start and end dates
        const defaultStartDate = new Date(); // Current date
        defaultStartDate.setDate(defaultStartDate.getDate() - 7); // 7 days ago
        const defaultEndDate = new Date(); // Current date

        // Extract year, month, and day from default dates
        const defaultStartYear = defaultStartDate.getFullYear();
        const defaultStartMonth = defaultStartDate.getMonth() + 1; // Months are zero-based
        const defaultStartDay = defaultStartDate.getDate();
        const defaultEndYear = defaultEndDate.getFullYear();
        const defaultEndMonth = defaultEndDate.getMonth() + 1; // Months are zero-based
        const defaultEndDay = defaultEndDate.getDate();

        // Construct ISO formatted strings for default dates
        const isoDefaultStartDate = `${defaultStartYear}-${String(
          defaultStartMonth
        ).padStart(2, "0")}-${String(defaultStartDay).padStart(
          2,
          "0"
        )}T00:00:00Z`;
        const isoDefaultEndDate = `${defaultEndYear}-${String(
          defaultEndMonth
        ).padStart(2, "0")}-${String(defaultEndDay).padStart(
          2,
          "0"
        )}T23:59:59Z`;

        // Use dateRange or default dates based on availability
        const startDate = dateRange?.start
          ? dateRange.start
          : {
              year: defaultStartYear,
              month: defaultStartMonth,
              day: defaultStartDay,
            };
        const endDate = dateRange?.end
          ? dateRange.end
          : {
              year: defaultEndYear,
              month: defaultEndMonth,
              day: defaultEndDay,
            };

        // Construct ISO formatted strings for selected or default dates
        const isoStartDate = `${startDate.year}-${String(
          startDate.month
        ).padStart(2, "0")}-${String(startDate.day).padStart(
          2,
          "0"
        )}T00:00:00Z`;
        const isoEndDate = `${endDate.year}-${String(endDate.month).padStart(
          2,
          "0"
        )}-${String(endDate.day).padStart(2, "0")}T23:59:59Z`;

        const requestBody = {
          startDate: isoStartDate,
          endDate: isoEndDate,
        };

        console.log(requestBody);
        let res = await fetch("https://tfs-server.onrender.com/api/auditLog", {
          method: "POST",
          signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        let json = await res.json();
        setIsLoading(false);
        console.log(json);
        return {
          items: json, // Use the json array directly as items
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        return {
          items: [], // Return an empty array in case of error
        };
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(list.items);
    } else {
      const filtered = list.items.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, list.items]);

  useEffect(() => {
    if (!dateRange.start && !dateRange.end) {
      setFilteredItems(list.items);
    } else {
      const start = dateRange.start
        ? new Date(dateRange.start).toISOString()
        : null;
      const end = dateRange.end ? new Date(dateRange.end).toISOString() : null;

      const filtered = list.items.filter((item) => {
        const timestampISO = new Date(item.timestamp).toISOString();
        const timestamp = timestampISO.substring(0, 10);
        console.log(timestamp);
        return (
          (!start || timestampISO >= start.substring(0, 10)) &&
          (!end || timestampISO <= end.substring(0, 10))
        );
      });
      setFilteredItems(filtered);
      console.log("start", start.substring(0, 10));
    }
  }, [dateRange, list.items]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "acao":
        return (
          <div className="flex flex-col ">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "user_id":
        return (
          <div className="flex flex-col  ">
            <p className="text-bold text-sm capitalize">
              {cellValue ? cellValue : "-"}
            </p>
          </div>
        );
      case "movel":
        return (
          <div className="flex flex-col ">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "galera":
        return (
          <div className="flex flex-row whitespace-nowrap">
            <p className=" text-sm">{cellValue}</p>
          </div>
        );
      case "descricao":
        return (
          <div className="flex flex-col ">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "timestamp":
        const formattedTimestamp = new Date(cellValue)
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        return (
          <div className="flex flex-col whitespace-nowrap">
            <p className="text-bold text-sm capitalize">{formattedTimestamp}</p>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="px-4 flex h-screen w-full flex-col text-text">
      <div className="flex flex-col items-center ">
        <div className=" flex w-full md:w-[70%]">
          <Input
            aria-label="Search filtro"
            classNames={{
              inputWrapper: "bg-default-100",
              input: "text-sm",
            }}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[50%] flex flex-col gap-y-2 mt-4">
          <DateRangePicker
            label="Data"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <p>{}</p>
      </div>
      <div className=" flex flex-col lg:flex-row justify-center items-center mt-10">
        <div className="overflow-x-auto shadow border rounded-2xl w-full md:w-[70%]">
          <Table
            aria-label="Tabela Parquimetro"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            color="primary"
            selectionMode="single"
            align="end"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align="end"
                  className=""
                  allowsSorting={column.uid === "acao"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={items}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item) => (
                <TableRow key={item._id} className="">
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
