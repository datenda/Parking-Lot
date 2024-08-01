"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { User } from "@nextui-org/user";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { decode } from "jsonwebtoken";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const [filteredItems, setFilteredItems] = useState(siteConfig.navItems);
  const items = [
    {
      key: "perfil",
      label: "Perfil",
    },
    {
      key: "utilizadores",
      label: "Criar utilizadores",
    },
    {
      key: "logout",
      label: "Sair",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  let decodedToken;
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    decodedToken = decode(storedToken);
  }

  const userName =
    decodedToken && decodedToken.user ? decodedToken.user.colaborador : "Guest";
  const userDescription =
    decodedToken && decodedToken.user ? decodedToken.user.funcao : "Guest";
  const allowedRole =
    decodedToken && decodedToken.user ? decodedToken.user.role[0] : "Guest";

  useEffect(() => {
    const filteredItems = siteConfig.navItems.filter((item) => {
      return item.role && item.role.includes(allowedRole);
    });

    setFilteredItems(filteredItems);
  }, [allowedRole]); // Run effect whenever allowedRole changes

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      classNames={{ toggleIcon: "text-primary" }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit text-primary">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/parquimetro"
          >
            <Logo />
            <p className="font-bold text-inherit">TFS</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {filteredItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        {isClient ? (
          <Dropdown>
            <DropdownTrigger>
              <User
                name={userName}
                description={userDescription}
                className="text-text"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              className="text-text"
            >
              {items.map((item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "logout" ? "danger" : "default"}
                  className={item.key === "logout" ? "text-danger" : ""}
                  onClick={
                    item.key === "logout"
                      ? () => handleLogout()
                      : item.key === "utilizadores" && allowedRole === "admin"
                      ? () => router.push("/utilizadores")
                      : undefined
                  }
                  style={{
                    display:
                      item.key === "utilizadores" && allowedRole !== "admin"
                        ? "none"
                        : "block",
                  }}
                >
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div>sicke</div>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2 items-start">
          <Dropdown>
            <DropdownTrigger>
              <User
                name={userName}
                description={userDescription}
                className="text-text"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              className="text-text"
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "logout" ? "danger" : "default"}
                  className={item.key === "logout" ? "text-danger" : ""}
                  onClick={
                    item.key === "logout" ? () => handleLogout() : undefined
                  }
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
