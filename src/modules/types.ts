import type { ComponentType, LazyExoticComponent } from "react";

export type ModuleComponent = LazyExoticComponent<ComponentType>;

export type ModuleComponentRoute = {
  path: string;
  component: ModuleComponent;
  label?: string;
};

export type ModuleRedirectRoute = {
  path: string;
  redirectTo: string;
  label?: string;
};

export type ModuleRoute = ModuleComponentRoute | ModuleRedirectRoute;

export type ModuleNavigation = {
  path: string;
  label?: string;
  icon?: string;
};

export type ModuleManifest = {
  id: string;
  name: string;
  description: string;
  component: ModuleComponent;
  navigation: ModuleNavigation;
  routes?: ModuleRoute[];
  permissions?: string[];
  requirements?: string[];
  enabledByDefault: boolean;
  defaultRoute?: boolean;
};

type ModuleRouteMeta = {
  id: string;
  moduleId: string;
};

export type ModuleRouteDefinition =
  | (ModuleComponentRoute & ModuleRouteMeta)
  | (ModuleRedirectRoute & ModuleRouteMeta);
