"use client";

import { useAsyncList } from "@react-stately/data";
import { EditIcon } from "@/components/EditIcon";
import { DeleteIcon } from "@/components/DeleteIcon";
import { EyeIcon } from "@/components/EyeIcon";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  useDisclosure,
  Chip,
  Tooltip,
  Pagination,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { decode } from "jsonwebtoken";
import { showToast, showPromiseToast } from "../../components/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function GalerasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [modalItem, setModalItem] = useState();
  const [selectedEstado, setSelectedEstado] = useState();
  const {
    isOpen: isOpenDet,
    onOpen: onOpenDet,
    onClose: onCloseDet,
  } = useDisclosure();
  const {
    isOpen: isOpenDel,
    onOpen: onOpenDel,
    onClose: onCloseDel,
  } = useDisclosure();
  const [edit, setEdit] = useState();
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const columns = [
    { name: "Matricula", uid: "matricula" },
    { name: "Móvel", uid: "movel" },
    { name: "Enc", uid: "enc" },
    { name: "Descrição", uid: "estado.descricao" },
    { name: "Peritagem", uid: "peritagem" },
    { name: "Ações", uid: "actions" },
  ];

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch(
          "https://tfs-server-1.onrender.com/api/galera/peritagem",
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

  const handleEstado = async (matricula, estado) => {
    try {
      if (matricula == null || estado == null) {
        showToast("error", "Preencha todos os campos necessários");
        return; // Exit the function if any field is empty
      }

      const requestBody = {
        matricula: matricula,
        status: estado,
        op: "oficina",
      };

      let fetchLugar = await fetch(
        "https://tfs-server-1.onrender.com/api/galera/mudarPeritagem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      const jsonResponse = await fetchLugar.json();
      if (!fetchLugar.ok) {
        throw new Error("Failed to fetch data");
      }
      onCloseDet();
      if (fetchLugar.status === 200) {
        setFilteredItems((prevFilteredItems) =>
          prevFilteredItems.filter(
            (item) => item.matricula !== jsonResponse.selectedGalera.matricula
          )
        );
        showToast(
          "success",
          `A galera foi enviada para o lugar ${jsonResponse.lugar.lugar}`
        );
      } else if (fetchLugar.status === 201) {
        setFilteredItems((prevFilteredItems) => {
          return prevFilteredItems.map((item) => {
            if (item.matricula === jsonResponse.matricula) {
              console.log(jsonResponse.matricula);

              return jsonResponse;
            }
            return item;
          });
        });
        showToast("success", "Estado mudado!");
      } else {
        // Handle other status codes
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "Tente dar refresh");
    }
  };

  const handleRowClick = (itemId) => {
    const selected = filteredItems.find((item) => item._id === itemId);
    if (selected) {
      setModalItem(selected);
    }
  };

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
      case "estado.descricao":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "peritagem":
        return (
          <Chip
            className="capitalize"
            color={
              cellValue === "pronto"
                ? "success"
                : cellValue === "standby"
                ? "warning"
                : cellValue === "espera"
                ? "danger"
                : "danger" // Default to "danger" for any other value
            }
            size="sm"
            variant="flat"
          >
            {cellValue === "pronto"
              ? "Pronto"
              : cellValue === "standby"
              ? "Espera de Peças"
              : cellValue === "oficina"
              ? "Oficina"
              : "Espera de peritagem"}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex  gap-2 text-text">
            <Tooltip content="Detalhes" className="text-text">
              <span className="text-lg  cursor-pointer active:opacity-50">
                <button onClick={() => onOpenDet()}>
                  <EyeIcon />
                </button>
              </span>
            </Tooltip>

            <div onClick={() => onOpenDel()}>remover</div>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const checkboxes = [
    { name: "Pronto", value: "pronto" },
    { name: "Mandar para oficina", value: "standby" },
    { name: "Mandar para parquimetro", value: "espera" },
  ];

  const handleRemover = async (veiculo) => {
    const requestBody = {
      veiculo: veiculo,
    };
    console.log(veiculo);
    let fetchLugar = await fetch(
      "https://tfs-server-1.onrender.com/api/galera/removerStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const jsonResponse = await fetchLugar.json();
    if (!fetchLugar.ok) {
      showToast("danger", "deu erro");
    }
    showToast("success", "sucesso!");
  };

  return (
    <div className="px-4 flex h-screen w-full flex-col text-text">
      <ToastContainer
        toastClassName=" relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        theme="dark"
        bodyClassName={() => "text-sm font-white font-med block p-3"}
        position="bottom-left"
        autoClose={3000}
      />
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
                <TableRow
                  key={item._id}
                  className=""
                  onClick={() => handleRowClick(item._id)}
                >
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Modal isOpen={isOpenDet} onClose={onCloseDet} placement="center">
          <ModalContent>
            {(onCloseDet) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Detalhes da Galera
                </ModalHeader>
                <ModalBody>
                  <div className="text-text">
                    {modalItem ? (
                      <div>
                        <div>Matricula: {modalItem.matricula}</div>
                        <div>Encarregado: {modalItem.enc}</div>
                        <div>estado: {modalItem.oficina}</div>
                        <Autocomplete
                          isRequired
                          label="Estado"
                          selectionMode="single"
                          placeholder={modalItem.oficina}
                          selectedKeys={selectedEstado}
                          onSelectionChange={setSelectedEstado}
                          allowsCustomValue={true}
                        >
                          {checkboxes.map((checkbox) => (
                            <AutocompleteItem
                              value={checkbox}
                              className="text-text"
                              key={checkbox.value}
                            >
                              {checkbox.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                    ) : (
                      <Spinner label="Loading..." />
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={() => {
                        handleEstado(modalItem.matricula, selectedEstado);
                      }}
                    >
                      Trocar
                    </Button>
                    <Button color="danger" onPress={onCloseDet}>
                      Fechar
                    </Button>
                  </ModalFooter>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenDel} onClose={onCloseDel} placement="center">
          <ModalContent>
            {(onCloseDel) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Remover galera
                </ModalHeader>
                <ModalBody>
                  <div className="text-text">
                    {modalItem && (
                      <div>
                        tem a certeza que quer remover o veiculo{" "}
                        {modalItem.matricula}
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={() => {
                        handleRemover(modalItem._id);
                      }}
                    >
                      Remover
                    </Button>
                    <Button color="danger" onPress={onCloseDel}>
                      Fechar
                    </Button>
                  </ModalFooter>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
