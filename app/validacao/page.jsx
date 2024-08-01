"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { decode } from "jsonwebtoken";

export default function ValidarPage() {
  let decodedToken = null;
  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);

  const listaValidar = async () => {
    try {
      const response = await fetch(
        "https://tfs-server-1.onrender.com/api/galera/porValidar",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetch request completed."); // Debugging statement

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Parsed JSON data:", data); // Debugging statement

      setLista(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    listaValidar();
  }, []);

  const handleChange = async (veiculo) => {
    try {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        decodedToken = decode(storedToken);
      }
      const requestBody = {
        veiculo: veiculo,
        user_id: decodedToken.user.colaborador,
      };

      const response = await fetch(
        "https://tfs-server-1.onrender.com/api/galera/validar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Fetch request completed."); // Debugging statement

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseBody = await response.json();

      if (response.status === 200) {
        setLista((prevFilteredItems) => {
          return prevFilteredItems.filter(
            (item) => item._id !== responseBody._id
          );
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  return (
    <div className="w-full flex">
      <div className="w-full bg-foreground border-2 border-[#0e152f] m-36 rounded text-text">
        {console.log(lista)}
        {lista.length > 0 ? (
          lista.map((item, index) => (
            <div
              key={index}
              className="m-4 flex flex-row justify-between items-center"
            >
              <div>
                Quer aprovar a saída do veiculo {item.matricula}? (Ao fazer isso
                também irá alertar o encarregado do mesmo)
              </div>
              <Image
                src="/yes.svg"
                alt="SVG"
                width={50}
                height={50}
                onClick={() => handleChange(item._id)}
              />
            </div>
          ))
        ) : (
          <p>Não há viaturas que precisam de validação</p>
        )}
      </div>
    </div>
  );
}
