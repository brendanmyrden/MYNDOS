import { getEnabledModuleLinks } from "../../modules/registry";

export type ModuleLink = {
  name: string;
  path: string;
  moduleName: string;
  icon: string;
};

export const moduleLinks: ModuleLink[] = getEnabledModuleLinks();
