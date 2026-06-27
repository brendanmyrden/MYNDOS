import { myndosModule } from "./myndos/manifest";
import { myrryrModule } from "./myrryr/manifest";
import { numbersStarsSignsModule } from "./numbers-stars-signs/manifest";
import { prompttracModule } from "./prompttrac/manifest";
import { raphiModule } from "./raphi/manifest";
import { sanctuaryModule } from "./sanctuary/manifest";
import { settingsModule } from "./settings/manifest";
import { streamsModule } from "./streams/manifest";
import { syyrModule } from "./syyr/manifest";
import { taskpillModule } from "./taskpill/manifest";
import type { ModuleManifest, ModuleRouteDefinition } from "./types";

export type ModuleRegistryLink = {
  name: string;
  path: string;
  moduleName: string;
  icon: string;
};

export const moduleRegistry = [
  myndosModule,
  sanctuaryModule,
  taskpillModule,
  raphiModule,
  myrryrModule,
  syyrModule,
  numbersStarsSignsModule,
  streamsModule,
  settingsModule,
  prompttracModule,
] satisfies ModuleManifest[];

const moduleRegistryById = new Map(moduleRegistry.map((module) => [module.id, module]));

export const getAllModules = (): ModuleManifest[] => [...moduleRegistry];

export const getEnabledModules = (): ModuleManifest[] =>
  moduleRegistry.filter((module) => module.enabledByDefault);

export const getModuleById = (id: string): ModuleManifest | undefined =>
  moduleRegistryById.get(id);

export const getDefaultModule = (): ModuleManifest | null => {
  const enabledModules = getEnabledModules();
  return enabledModules.find((module) => module.defaultRoute) ?? enabledModules[0] ?? null;
};

export const getEnabledModuleRoutes = (): ModuleRouteDefinition[] =>
  getEnabledModules().flatMap((module) => [
    {
      id: `${module.id}:home`,
      moduleId: module.id,
      path: module.navigation.path,
      component: module.component,
    },
    ...(module.routes ?? []).map((route) => ({
      ...route,
      id: `${module.id}:${route.path}`,
      moduleId: module.id,
    })),
  ]);

export const getEnabledModuleLinks = (): ModuleRegistryLink[] =>
  getEnabledModules().map((module) => ({
    name: module.navigation.label ?? module.name,
    path: module.navigation.path,
    moduleName: module.id,
    icon: module.navigation.icon ?? "",
  }));
