"use client";

import { useAsyncList } from "@react-stately/data";
import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";

export default function GalerasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [edit, setEdit] = useState();
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const columns = [
    { name: "Matricula", uid: "matricula" },
    { name: "Móvel", uid: "movel" },
    { name: "Enc", uid: "enc" },
    { name: "Estado", uid: "estado.status" },
    { name: "Descrição", uid: "estado.descricao" },
    { name: "Codigo de Acesso", uid: "acesso" },
  ];

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch(
          "https://tfs-server.onrender.com/api/galera/prontas",
          {
            method: "GET",
            signal,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, list.items]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const renderCell = React.useCallback((item, columnKey) => {
    let cellValue;
    if (columnKey === "estado.descricao" || columnKey === "estado.status") {
      // Check if estado exists
      if (item.estado) {
        if (columnKey === "estado.descricao") {
          cellValue = item.estado.descricao;
        } else if (columnKey === "estado.status") {
          cellValue = item.estado.status;
        }
      } else {
        cellValue = "";
      }
    } else {
      // For other columns, directly access the property
      cellValue = item[columnKey];
    }

    switch (columnKey) {
      case "movel":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "descricao":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "estado.descricao":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
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
