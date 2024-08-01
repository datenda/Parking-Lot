"use client";
import { EditIcon } from "@/components/EditIcon";
import { DeleteIcon } from "@/components/DeleteIcon";
import { EyeIcon } from "@/components/EyeIcon";
import React, { useEffect, useState } from "react";
import { decode } from "jsonwebtoken";
import { useAsyncList } from "@react-stately/data";
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
  ButtonGroup,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { showToast, showPromiseToast } from "../../components/toast";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@nextui-org/input";

export default function ParquimetroPage() {
  let decodedToken = null;
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const {
    isOpen: isOpenDet,
    onOpen: onOpenDet,
    onClose: onCloseDet,
  } = useDisclosure();
  const {
    isOpen: isOpenNewLugar,
    onOpen: onOpenNewLugar,
    onClose: onCloseNewLugar,
  } = useDisclosure();
  const {
    isOpen: isOpenDel,
    onOpen: onOpenDel,
    onClose: onCloseDel,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();
  const [edit, setEdit] = useState();
  const [letra, setLetra] = useState("");
  const [quantos, setQuantos] = useState();
  const [inputValue, setInputValue] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const [lugar, setLugar] = useState();
  const [km, setKm] = useState();
  const [galeraInfo, setGaleraInfo] = useState();
  const [show, setShow] = useState(false);
  const [selectedGalera, setSelectedGalera] = useState();
  const [local, setLocal] = useState();
  const [isValid, setIsValid] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [newGalera, setNewGalera] = useState();
  const [email, setEmail] = useState("");
  const [newMovel, setNewMovel] = useState();
  const [row, setRow] = useState();
  const [modalItem, setModalItem] = useState();
  const [empresa, setEmpresa] = useState();
  const [newUser, setNewUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [cod, setCod] = useState();

  let list = useAsyncList({
    async load({ signal }) {
      try {
        let res = await fetch(
          "https://tfs-server-1.onrender.com/api/parquimetro",
          {
            method: "GET",
            signal,
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        let json = await res.json();
        setIsLoading(false);

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

  const fetchGalera = async (selected) => {
    try {
      const requestBody = {
        matricula: selected.galera,
      };
      let response = await fetch(
        "https://tfs-server-1.onrender.com/api/galera/verificar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      let json = await response.json();

      setEdit(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpen = (selected, type) => {
    switch (type) {
      case "details":
        onOpenDet();
        fetchGalera(selected);
        break;
      case "edit":
        onOpenEdit(); // Open the edit modal
        break;
      case "delete":
        onOpenDel();
        fetchGalera(selected);
      default:
        // Default case
        break;
    }
  };

  const columns = [
    { name: "Lugar", uid: "lugar" },
    { name: "Galera", uid: "galera" },
    { name: "Ocupado", uid: "ocupado" },
    { name: "Pronto", uid: "pronto" },
    { name: "Ações", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "lugar":
          return (
            <div className="flex flex-col ">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "galera":
          return (
            <div className="flex flex-col  ">
              <p className="text-bold text-sm capitalize">
                {cellValue ? cellValue : "-"}
              </p>
            </div>
          );
        case "ocupado":
          return (
            <Chip
              className="capitalize"
              color={cellValue ? "danger" : "success"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "Indisponível" : "Disponível"}
            </Chip>
          );
        case "pronto":
          return (
            <Chip
              className="capitalize"
              color={
                cellValue === undefined
                  ? "info"
                  : cellValue
                  ? "success"
                  : "danger"
              }
              size="sm"
              variant="flat"
            >
              {cellValue == null ? "-" : cellValue ? "Ok" : "Fica"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex gap-2 text-text">
              {isAdmin && (
                <Tooltip content="Perigoso" className="text-text">
                  <span className="text-lg  cursor-pointer active:opacity-50">
                    <button onClick={() => handleOpen(user, "details")}>
                      <EyeIcon />
                    </button>
                  </span>
                </Tooltip>
              )}
              <Tooltip color="danger" content="Saida">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <button onClick={() => handleOpen(user, "delete")}>
                    <DeleteIcon />
                  </button>
                </span>
              </Tooltip>

              {isAdmin && (
                <div className="flex justify-end text-danger">
                  <button onClick={() => handleDeleteLugar(user)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [isAdmin]
  );

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    if (inputValue && selectedCheckbox.length >= 1) {
      setShowSelect(true);
      console.log(inputValue);
      console.log(selectedCheckbox);
    }
  }, [selectedCheckbox, inputValue]);

  const handleSaida = async (lugar, veiculo, codigo) => {
    try {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        decodedToken = decode(storedToken);
      }
      if (parseInt(cod) !== 515151 && edit.acesso !== parseInt(cod)) {
        console.log(edit.acesso);
        console.log(cod);

        showToast("error", "O código está errado");
      } else {
        const requestBody = {
          user_id: decodedToken.user.colaborador,
          lugar: lugar,
          veiculo: veiculo,
        };

        let fetch3 = await fetch(
          "https://tfs-server-1.onrender.com/api/parquimetro/remover",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!fetch3.ok) {
          throw new Error("Failed to fetch data");
          showToast("error", "Não foi possivel remover galera");
        }
        const jsonResponse = await fetch3.json();
        if (jsonResponse) {
          showToast("success", "Galera removida!");
          setCod();
        }
        onCloseDel();
        setFilteredItems((prevFilteredItems) => {
          return prevFilteredItems.map((item) => {
            if (item.lugar === jsonResponse.lugar) {
              return jsonResponse;
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "O lugar já não tem galera");
      onCloseDel();
    }
  };

  const handleEstacionar = async () => {
    try {
      if (lugar == null || inputValue == undefined || newUser == undefined) {
        setIsValid(true);
        showToast("error", "preencha todos os campos necessários");
      } else {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("token");
          decodedToken = decode(storedToken);
        }

        const requestBody = {
          lugar: lugar,
          veiculo: inputValue,
          user_id: newUser,
          descricao: descricao,
          status: selectedCheckbox.toString(),
          km: km,
        };

        let fetch2 = await fetch(
          "https://tfs-server-1.onrender.com/api/parquimetro/estacionar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!fetch2.ok) {
          showToast("error", "ja esta estacionada");
          throw new Error("Failed to fetch data");
        }
        const jsonResponse = await fetch2.json();
        setIsValid(false);
        showToast("success", "Galera estacionada");
        setLugar("");
        setInputValue("");
        setDescricao("");
        setSelectedCheckbox("");
        onCloseCreate();
        setFilteredItems((prevFilteredItems) => {
          return prevFilteredItems.map((item) => {
            if (item.lugar === jsonResponse.lugar) {
              return jsonResponse;
            }
            return item;
          });
        });
      }
    } catch (error) {
      showToast("error", "problemas no sistema");
      console.error("Error fetching data:", error);
    }
  };

  const handleNewGalera = async () => {
    try {
      // Check if any required field is null or empty
      if (
        lugar == null ||
        newGalera.trim() === "" ||
        empresa.trim() === "" ||
        selectedCheckbox.length === 0
      ) {
        setIsValid(true);
        showToast("error", "Preencha todos os campos necessários");
        return; // Exit the function if any field is empty
      }

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        decodedToken = decode(storedToken);
      }

      const requestBody = {
        lugar: lugar,
        galera: newGalera,
        empresa: empresa,
        email: email,
        user_id: decodedToken.user.colaborador,
        descricao: descricao,
        status: selectedCheckbox.toString(),
        km: km,
      };

      let fetch2 = await fetch(
        "https://tfs-server-1.onrender.com/api/parquimetro/novaGalera",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (fetch2.status === 401) {
        setShow(true);
        showToast(
          "error",
          "Encarregado não tem email, por favor introduza um email"
        );
      } else if (fetch2.status === 200) {
        const jsonResponse = await fetch2.json();
        setIsValid(false);
        setShow(false);
        showToast("success", "Estacionada com sucesso");
        setNewGalera("");
        setNewMovel("");
        setEmpresa("");
        setDescricao("");
        setSelectedCheckbox("");
        onCloseNew();
        setFilteredItems((prevFilteredItems) => {
          return prevFilteredItems.map((item) => {
            if (item.lugar === jsonResponse.lugar) {
              return jsonResponse;
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const handleGalera = async () => {
      onCloseCreate();
      try {
        let fetch1 = await fetch(
          "https://tfs-server-1.onrender.com/api/galera",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!fetch1.ok) {
          throw new Error("Failed to fetch data");
        }
        let json = await fetch1.json();
        setGaleraInfo(json);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "tente dar refresh");
      }
    };

    handleGalera();
  }, []);

  const checkboxes = [
    { name: "Manutenção/Revisão", value: "manutencao" },
    { name: "Frio", value: "frio" },
    { name: "Manutenção normal e frio", value: "man_frio" },
    { name: "Sinistros (em caso de acidente)", value: "sinistros" },
    { name: "Peritagem (peritagem com o Cassiano)", value: "peritagem" },
    { name: "Sondas/ATP (verificação ISQ)", value: "sondas" },
    {
      name: "Parqueamento (viaturas prontas em stock)",
      value: "parqueamento",
    },
    { name: "Chegada de perigoso (sub contrador)", value: "chegada" },
  ];

  const handlePerigoso = async (veiculo, email, lugar, local) => {
    try {
      const requestBody = {
        email: email,
        veiculo: veiculo,
        lugar: lugar,
        local: local,
      };
      let fetch1 = await fetch(
        "https://tfs-server-1.onrender.com/api/parquimetro/perigoso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!fetch1.ok) {
        throw new Error("Failed to fetch data");
      }
      onCloseDet();
      setEmail();
      showToast("success", "Perigoso vou alertado");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewLugar = async (letra, num) => {
    try {
      // Check if any required field is null or empty
      if (letra == null) {
        showToast("error", "Preencha todos os campos necessários");
        return; // Exit the function if any field is empty
      }

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        decodedToken = decode(storedToken);
      }

      const requestBody = {
        letra: letra,
        num: parseInt(num),
      };

      let fetchLugar = await fetch(
        "https://tfs-server-1.onrender.com/api/parquimetro/novoLugar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!fetchLugar.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonResponse = await fetchLugar.json();
      jsonResponse.forEach((item) => {
        setFilteredItems((prevItems) => [...prevItems, item]);
      });
      showToast("success", "Lugar criado");
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "Tente dar refresh");
    }
  };

  const handleEstado = async (matricula, estado) => {
    try {
      if (matricula == null || estado == null) {
        showToast("error", "Preencha todos os campos necessários");
        return; // Exit the function if any field is empty
      }

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        decodedToken = decode(storedToken);
      }

      const requestBody = {
        matricula: matricula,
        status: estado,
        op: "parquimetro",
      };

      let fetchLugar = await fetch(
        "https://tfs-server-1.onrender.com/api/galera/mudar",
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
        showToast("success", "Estado mudado!");
      } else if (fetchLugar.status === 201) {
        setFilteredItems((prevFilteredItems) => {
          return prevFilteredItems.map((item) => {
            if (item.lugar === jsonResponse.lugar) {
              return jsonResponse;
            }
            return item;
          });
        });
        showToast("success", "A galera foi para a oficina");
      } else {
        // Handle other status codes
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("error", "Tente dar refresh");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      decodedToken = decode(storedToken);
      if (decodedToken.user.role == "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [decodedToken]); // Re-run effect when decodedToken changes

  const handleRowClick = (itemId) => {
    const selected = filteredItems.find((item) => item._id === itemId);
    if (selected) {
      setModalItem(selected);
    }
  };

  const handleDeleteLugar = async (user) => {
    console.log(user);
    const requestBody = {
      id: user._id,
    };
    try {
      let fetchLugar = await fetch(
        "https://tfs-server-1.onrender.com/api/parquimetro/removerLugar",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!fetchLugar.ok) {
        throw new Error("Failed to fetch data");
      }
      showToast("success", "Eliminado");
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = () => {
    onCloseCreate();
    onOpenNew();
  };
  const handleCreateChange = () => {
    onCloseCreate();
    setInputValue("");
    setShowSelect(false);
  };
  const onInputChange = (value) => {
    setNewGalera(value);
  };
  return (
    <>
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
        <div className="flex lg:flex-row justify-end items-center mt-4 w-full md:w-[85%]">
          {isAdmin && (
            <Button className="mr-4" onPress={() => onOpenNewLugar()}>
              Criar lugares
            </Button>
          )}
          <Modal
            isOpen={isOpenNewLugar}
            onClose={onCloseNewLugar}
            placement="center"
          >
            <ModalContent>
              {(onCloseNewLugar) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-text">
                    Adicionar lugar(es)
                  </ModalHeader>
                  <ModalBody>
                    <div className="text-text">
                      <Input
                        label="letra de espaço"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={letra}
                        onChange={(e) => setLetra(e.target.value)}
                      />
                      <Input
                        className="mt-4"
                        label="Quantos lugares quer"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={quantos}
                        onChange={(e) => setQuantos(e.target.value)}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={() => handleNewLugar(letra, quantos)}
                    >
                      Criar
                    </Button>
                    <Button color="danger" onPress={onCloseNewLugar}>
                      Fechar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          {!isLoading && (
            <Button color="primary" onPress={() => onOpenCreate()}>
              Estacionar
            </Button>
          )}
        </div>
        <div className=" flex flex-col lg:flex-row justify-center items-center mt-10">
          <div className="overflow-x-auto shadow border rounded-2xl w-full md:w-[70%]">
            <Table
              aria-label="Tabela Parquimetro"
              sortDescriptor={list.sortDescriptor}
              onSortChange={list.sort}
              color="primary"
              selectionMode="single"
              selectedKeys={row}
              onSelectionChange={setRow}
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
                    allowsSorting={
                      column.uid !== "actions" &&
                      column.uid !== "lugar" &&
                      column.uid !== "galera"
                    }
                    // Allow sorting only if uid is not "actions"
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
        </div>
        <Modal isOpen={isOpenDet} onClose={onCloseDet} placement="center">
          <ModalContent>
            {(onCloseDet) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Ordem de perigoso
                </ModalHeader>
                <ModalBody>
                  <div className="text-text">
                    {edit ? (
                      <div>
                        {console.log(modalItem)}
                        <div>
                          Tem a certeza que quer fazer ordem de perigoso no
                          veiculo {modalItem.galera}?
                        </div>
                        <Input
                          isRequired
                          label="Local"
                          classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                          }}
                          value={local}
                          onChange={(e) => setLocal(e.target.value)}
                          className="mt-4"
                        />
                        <Input
                          isRequired
                          label="Email de perigoso"
                          classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                          }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="my-4 text-text"
                        />
                      </div>
                    ) : (
                      <Spinner label="Loading..." />
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalFooter>
                    {local && email && (
                      <Button
                        color="primary"
                        onPress={() => {
                          handlePerigoso(
                            modalItem.galera,
                            email,
                            modalItem.lugar,
                            local
                          );
                        }}
                      >
                        Sim
                      </Button>
                    )}
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
                  Saída de viatura
                </ModalHeader>
                <ModalBody>
                  <div className="text-text w-full">
                    Tem a certeza que quer dar saida da viatura{" "}
                    {modalItem.galera}?
                  </div>
                  <Input
                    isRequired
                    label="Codigo de saida"
                    classNames={{
                      inputWrapper: "bg-default-100",
                      input: "text-sm",
                    }}
                    value={cod}
                    onChange={(e) => setCod(e.target.value)}
                    className="mb-4 text-text"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() =>
                      handleSaida(modalItem.lugar, modalItem.galera, cod)
                    }
                  >
                    Sim
                  </Button>
                  <Button color="danger" onPress={onCloseDel}>
                    Não
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpenCreate}
          onClose={handleCreateChange}
          placement="center"
        >
          <ModalContent>
            {(onCloseCreate) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Estacionar
                </ModalHeader>
                <ModalBody className="text-text">
                  <div>
                    <Autocomplete
                      isRequired
                      label="Galera"
                      placeholder="Selecionar galera"
                      selectionMode="single"
                      defaultItems={galeraInfo}
                      selectedKeys={selectedGalera}
                      onSelectionChange={handleInputChange}
                      onInputChange={onInputChange}
                      listboxProps={{
                        emptyContent: (
                          <button
                            className="text-text"
                            onClick={() => handleModal()}
                          >
                            Adicionar galera no caso de não existir
                          </button>
                        ),
                      }}
                    >
                      {(galera) => (
                        <AutocompleteItem
                          key={galera._id}
                          value={galera.matricula}
                          className="text-text"
                        >
                          {galera.matricula}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>
                  <div className="my-4">
                    <CheckboxGroup
                      isRequired
                      label="Selecione o processo"
                      value={selectedCheckbox}
                      onValueChange={setSelectedCheckbox}
                    >
                      {checkboxes.map((checkbox, index) => (
                        <Checkbox
                          color="text-text"
                          key={index}
                          value={checkbox.value}
                          isDisabled={
                            checkbox.value !== selectedCheckbox.toString() &&
                            selectedCheckbox.toString() !== ""
                          }
                        >
                          <div className="text-text">{checkbox.name}</div>
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                  {showSelect && (
                    <div>
                      <Input
                        isRequired
                        label="Kms"
                        placeholder="Quilometros feitos"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        className="mb-4"
                      />
                      <Input
                        isRequired
                        label="Colaborador"
                        placeholder="Colaborador a entregar"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                      />
                      <Autocomplete
                        isRequired
                        label="Espaço"
                        placeholder="Selecionar espaço"
                        selectionMode="single"
                        selectedKeys={lugar}
                        onSelectionChange={setLugar}
                        className="mt-4"
                      >
                        {filteredItems
                          .filter((spot) => !spot.ocupado)
                          .map((spot) => (
                            <AutocompleteItem
                              key={spot.lugar}
                              value={spot.lugar}
                              className="text-text"
                            >
                              {spot.lugar}
                            </AutocompleteItem>
                          ))}
                      </Autocomplete>

                      <Textarea
                        color="text-text"
                        label="Descrição"
                        labelPlacement="outside"
                        placeholder="Propósito de entrada"
                        value={descricao}
                        onValueChange={setDescricao}
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={() => handleEstacionar()}>
                    Ok
                  </Button>
                  <Button color="danger" onPress={() => onCloseCreate()}>
                    Fechar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenNew} onClose={onCloseNew} placement="center">
          <ModalContent>
            {(onCloseNew) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Galera externa
                </ModalHeader>
                <ModalBody>
                  <div className="text-text flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input
                        isRequired
                        label="Matricula"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={newGalera}
                        onChange={(e) => setNewGalera(e.target.value)}
                      />
                    </div>
                    <Input
                      isRequired
                      label="Kms"
                      placeholder="Quilometros feitos"
                      classNames={{
                        inputWrapper: "bg-default-100",
                        input: "text-sm",
                      }}
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                    />
                    <Input
                      isRequired
                      label="Encarregado"
                      classNames={{
                        inputWrapper: "bg-default-100",
                        input: "text-sm",
                      }}
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                    />
                    {show && (
                      <Input
                        isRequired
                        type="email"
                        label="Email"
                        classNames={{
                          inputWrapper: "bg-default-100",
                          input: "text-sm",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                    <Autocomplete
                      isRequired
                      label="Espaço"
                      placeholder="Selecionar espaço"
                      selectionMode="single"
                      selectedKeys={lugar}
                      isInvalid={isValid}
                      onSelectionChange={setLugar}
                    >
                      {filteredItems
                        .filter((spot) => !spot.ocupado)
                        .map((spot) => (
                          <AutocompleteItem
                            key={spot.lugar}
                            value={spot.lugar}
                            className="text-text"
                          >
                            {spot.lugar}
                          </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <div className="my-4">
                      <CheckboxGroup
                        isRequired
                        label="Selecione o processo"
                        value={selectedCheckbox}
                        onValueChange={setSelectedCheckbox}
                      >
                        {checkboxes.map((checkbox, index) => (
                          <Checkbox
                            color="text-text"
                            key={index}
                            value={checkbox.value}
                            isDisabled={
                              checkbox.value !== selectedCheckbox.toString() &&
                              selectedCheckbox.toString() !== ""
                            }
                          >
                            <div className="text-text">{checkbox.name}</div>
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>

                    <Textarea
                      color="text-text"
                      label="Descrição"
                      labelPlacement="outside"
                      placeholder="Propósito de entrada"
                      value={descricao}
                      onValueChange={setDescricao}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={() => handleNewGalera()}>
                    Ok
                  </Button>
                  <Button color="danger" onPress={onCloseNew}>
                    Fechar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
