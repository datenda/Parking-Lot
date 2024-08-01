export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TFS Parquimetro",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Parquimetro",
      href: "/parquimetro",
      role: ["portaria", "admin", "oficina", "rececao"],
    },
    {
      label: "Registos",
      href: "/registos",
      role: ["portaria", "admin", "rececao"],
    },
    {
      label: "Viaturas prontas",
      href: "/galeras",
      role: ["admin", "rececao"],
    },
    {
      label: "Oficina",
      href: "/oficina",
      role: ["oficina", "admin", "rececao"],
    },
    {
      label: "Peritagem",
      href: "/peritagem",
      role: ["peritagem", "admin"],
    },
    {
      label: "Validar saída",
      href: "/validacao",
      role: ["rececao", "admin"],
    },
    {
      label: "Sub contratados",
      href: "/externa",
      role: ["admin"],
    },
  ],
};
