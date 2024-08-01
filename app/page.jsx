"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = {
        colaborador: username,
        password: password,
      };

      const response = await fetch(
        "https://tfs-server.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData; // Extract token from response data

        if (token) {
          // Store token and redirect
          localStorage.setItem("token", token);
          router.push("/parquimetro");
        } else {
          // Handle case where token is missing in response
          console.error("Token missing in response");
          // Handle error accordingly
        }
      } else {
        // Handle non-200 status code
        console.error(`Request failed with status: ${response.status}`);
        // Handle error accordingly
      }
    } catch (error) {
      console.error("Error occurred:", error);
      // Handle error accordingly
    }
  };
  return (
    <div className="flex justify-center items-center h-screen text-text primary">
      <div className="w-full  max-w-lg h-[50%]">
        <div className="flex flex-col bg-foreground border-2 border-[#0e152f] shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-3xl font-bold text-center ">Login</h2>
          <div className="mb-8 mt-4">
            <div className="mb-8">
              <Input
                key="inside"
                label="Colaborador"
                value={username}
                onValueChange={setUsername}
                labelPlacement="outside"
                placeholder="Introduza o número de colaborador"
                color="primary"
              />
            </div>
            <div>
              <Input
                key="inside"
                type="password"
                label="Password"
                value={password}
                onValueChange={setPassword}
                labelPlacement="outside"
                placeholder="Introduza a sua password"
                color="primary"
              />
            </div>
          </div>
          <Button
            color="primary"
            variant="shadow"
            onPress={() => handleLogin()}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
