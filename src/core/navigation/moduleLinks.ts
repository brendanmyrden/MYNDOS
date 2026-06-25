import { getEnabledModules } from "../../modules/registry";

export type ModuleLink = {
  name: string;
  path: string;
  moduleName: string;
  icon: string;
};

export const moduleLinks: ModuleLink[] = getEnabledModules().map((module) => ({
  name: module.navigation.label ?? module.name,
  path: module.navigation.path,
  moduleName: module.id,
  icon: module.navigation.icon ?? "",
}));
