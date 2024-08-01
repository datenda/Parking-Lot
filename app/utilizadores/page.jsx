"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Input,
  Checkbox,
  CheckboxGroup,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  User,
  useDisclosure,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { DeleteIcon } from "@/components/DeleteIcon";
import { showToast, showPromiseToast } from "../../components/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeFilledIcon } from "@/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/EyeSlashFilledIcon";

export default function UtilizadoresPage() {
  const [colaborador, setColaborador] = useState();
  const [newColaborador, setNewColaborador] = useState();
  const [nome, setNome] = useState();
  const [funcao, setFuncao] = useState();
  const [passwordInfo, setPasswordInfo] = useState();
  const [colaboradorSelect, setColaboradorSelect] = useState();
  const [colaboradorInfo, setColaboradorInfo] = useState();
  const [password, setPassword] = useState();
  const [selected, setSelected] = React.useState();
  const [selectedRole, setSelectedRole] = React.useState();
  const [isVisible, setIsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const {
    isOpen: isOpenDel,
    onOpen: onOpenDel,
    onClose: onCloseDel,
  } = useDisclosure();
  const [modalItem, setModalItem] = useState();
  const toggleVisibility = () => setIsVisible(!isVisible);

  const pages = Math.ceil(users.length / rowsPerPage);

  let items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  useEffect(() => {
    if (colaboradorInfo !== undefined) {
      setSelectedRole(colaboradorInfo.role);
      setPasswordInfo(colaboradorInfo.password);
    }
  }, [colaboradorInfo]);

  const checkboxes = [
    { name: "Portaria", value: "portaria" },
    { name: "Oficina", value: "oficina" },
    { name: "Perito", value: "perito" },
    { name: "Receção", value: "rececao" },
    { name: "Administrador", value: "admin" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { name: "Colaborador", uid: "colaborador" },
    { name: "Função", uid: "role" },
    { name: "Ações", uid: "actions" },
  ];

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://tfs-server.onrender.com/api/users/findAll"
      );

      if (!response.ok) {
        showToast("error", "Não conseguiu ver as informações do utilizador");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast("error", "Erro no sistema");
    }
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "colaborador":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.nome}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex  gap-2 text-text">
            <Tooltip color="danger" content="Saida">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <button onClick={() => onOpenDel()}>
                  <DeleteIcon />
                </button>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    const fetchSingleUser = async (colaborador) => {
      const requestBody = {
        id: colaborador.currentKey,
      };
      try {
        const response = await fetch(
          "https://tfs-server.onrender.com/api/users/find",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setColaboradorInfo(data);
        console.log(data);
      } catch (error) {
        showToast("error", "Erro no sistema");
      }
    };
    if (colaboradorSelect !== undefined) {
      fetchSingleUser(colaboradorSelect);
    }
  }, [colaboradorSelect]);

  function ensureValue(value) {
    return value === undefined ? "" : value;
  }

  const editUser = async () => {
    const requestBody = {
      id: ensureValue(colaboradorInfo._id),
      colaborador: ensureValue(colaborador),
      nome: ensureValue(nome),
      funcao: ensureValue(funcao),
      password: ensureValue(passwordInfo),
      role: ensureValue(selectedRole),
    };
    try {
      const response = await fetch(
        "https://tfs-server.onrender.com/api/users/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        showToast("error", "Não conseguiu editar utilizador");
      }
      setColaborador(" ");
      setNome();
      setFuncao();
      setPassword();
      setColaboradorInfo();
      showToast("success", "O utilizador for atualizado!");
    } catch (error) {
      showToast("error", "Erro no sistema");
    }
  };

  const createUser = async (nr, pw, rl, nome, func) => {
    const requestBody = {
      colaborador: nr,
      nome: nome,
      funcao: func,
      password: pw,
      role: rl,
    };
    try {
      const response = await fetch(
        "https://tfs-server.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        showToast("error", "Não conseguiu criar utilizador");
      }
      setColaborador("");
      setNome("");
      setFuncao("");
      console.log(response);
      const newUser = await response.json(); // Assuming the response contains the new user data
      setUsers((prevUsers) => [...prevUsers, newUser]);
      showToast("success", "O utilizador foi criado!");
    } catch (error) {
      console.log(`erro: ${error}`);
      showToast("error", "Erro no sistema");
    }
  };

  const handleRowClick = (itemId) => {
    const selected = users.find((item) => item._id === itemId);
    if (selected) {
      setModalItem(selected);
      console.log(selected);
    }
  };

  const handleDelete = async (id) => {
    const requestBody = {
      id: id,
    };
    try {
      const response = await fetch(
        "https://tfs-server.onrender.com/api/users/remover",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        showToast("error", "Não conseguiu eliminar utilizador");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      onCloseDel();
      showToast("success", "O utilizador foi eliminado!");
    } catch (error) {
      console.log(`erro: ${error}`);
      showToast("error", "Erro no sistema");
    }
  };

  return (
    <div className="px-4 flex w-full text-text flex-col lg:flex-row">
      <ToastContainer
        toastClassName=" relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        theme="dark"
        bodyClassName={() => "text-sm font-white font-med block p-3"}
        position="bottom-left"
        autoClose={3000}
      />
      <div
        className="flex flex-col justify-start lg:w-[30%] border rounded-lg p-2"
        onClick={() => setColaboradorInfo()}
      >
        <div className="text-3xl my-2 font-bold">Novo Utilizador</div>
        <Input
          label="Número de Colaborador"
          placeholder="Insira colaborador"
          value={colaborador}
          onValueChange={setColaborador}
        />
        <Input
          label="Nome do colaborador"
          placeholder="Insira colaborador"
          value={nome}
          onValueChange={setNome}
          className="mt-4"
        />
        <Input
          label="Função"
          placeholder="Insira colaborador"
          value={funcao}
          onValueChange={setFuncao}
          className="mt-4"
        />
        <Input
          label="Password"
          placeholder="Insira password"
          value={password}
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="mt-4"
        />
        <CheckboxGroup
          label="Selecione a função do utilizador"
          color="warning"
          value={selected}
          onValueChange={setSelected}
          className="text-text mt-4"
        >
          {checkboxes.map((checkbox, index) => (
            <Checkbox color="text-text" key={index} value={checkbox.value}>
              <div className="text-text">{checkbox.name}</div>
            </Checkbox>
          ))}
        </CheckboxGroup>
        <div className="w-full flex justify-center mt-2">
          <Button
            color="primary"
            className="w-[70%]"
            onClick={() =>
              createUser(colaborador, password, selected, nome, funcao)
            }
          >
            Criar
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-start w-full lg:w-[30%] border rounded-lg p-2 lg:ml-6 mt-4 lg:mt-0">
        <div className="text-3xl my-2 font-bold">Lista de utilizadores</div>
        <div>
          <Table
            aria-label="Example table with custom cells"
            selectionMode="single"
            selectedKeys={colaboradorSelect}
            onSelectionChange={setColaboradorSelect}
            color="primary"
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
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow
                  key={item._id}
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
        <Modal isOpen={isOpenDel} onClose={onCloseDel} placement="center">
          <ModalContent>
            {(onCloseDel) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-text">
                  Saída de viatura
                </ModalHeader>
                <ModalBody>
                  <div className="text-text w-full">
                    Tem a certeza que eliminar o utilizador {modalItem.nome}?
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => handleDelete(modalItem._id)}
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
      </div>
      {colaboradorInfo ? (
        <div className="flex flex-col justify-start w-full lg:w-[30%] border rounded-lg p-2 lg:ml-6 mt-4 lg:mt-0">
          <div className="flex w-full justify-between items-center text-center">
            <div className="text-2xl font-bold my-2">
              {colaboradorInfo.nome}
            </div>
            <div className="my-2">
              <Button color="secondary" onPress={() => setEdit(!edit)}>
                Editar
              </Button>
            </div>
          </div>
          <Input
            isDisabled={edit}
            label="Colaborador"
            placeholder={colaboradorInfo.colaborador}
            value={newColaborador}
            onValueChange={setNewColaborador}
            className="my-2"
          />
          <Input
            isDisabled={edit}
            label="nome"
            placeholder={colaboradorInfo.nome}
            value={nome}
            onValueChange={setNome}
            className="my-2"
          />
          <Input
            isDisabled={edit}
            label="Função"
            placeholder={colaboradorInfo.funcao}
            value={funcao}
            onValueChange={setFuncao}
            className="my-2"
          />
          <Input
            label="Password"
            placeholder="Insira password"
            value={passwordInfo}
            onValueChange={setPasswordInfo}
            isDisabled={edit}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="mt-4"
          />
          <CheckboxGroup
            isDisabled={edit}
            label="Selecione a função do utilizador"
            value={selectedRole}
            defaultValue={[colaboradorInfo.role]}
            onValueChange={setSelectedRole}
            className="text-text mt-4"
          >
            {checkboxes.map((checkbox, index) => (
              <Checkbox color="text-text" key={index} value={checkbox.value}>
                <div className="text-text">{checkbox.value}</div>
              </Checkbox>
            ))}
          </CheckboxGroup>
          <Button
            color="primary"
            className="mt-2"
            isDisabled={edit}
            onPress={() => editUser()}
          >
            Enviar edição
          </Button>
        </div>
      ) : null}
    </div>
  );
}
