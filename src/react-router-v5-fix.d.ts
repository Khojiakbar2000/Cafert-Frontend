// Type declarations to fix React Router v5 compatibility with React 18
declare module 'react-router-dom' {
  import React from 'react';
  
  export interface RouteProps {
    path?: string;
    exact?: boolean;
    children?: React.ReactNode;
  }
  
  export interface SwitchProps {
    children?: React.ReactNode;
  }
  
  export interface NavLinkProps {
    to: string;
    activeClassName?: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }
  
  export interface LinkProps {
    to: string;
    children?: React.ReactNode;
  }
  
  export const Route: React.ComponentType<RouteProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const NavLink: React.ComponentType<NavLinkProps>;
  export const Link: React.ComponentType<LinkProps>;
  export const BrowserRouter: React.ComponentType<{ children?: React.ReactNode }>;
  export const useLocation: () => { pathname: string };
  export const useHistory: () => { push: (path: string) => void; goBack: () => void };
  export const useParams: () => { [key: string]: string };
  export const useRouteMatch: (path?: string) => { path: string; url: string };
} 
declare module 'react-router-dom' {
  import React from 'react';
  
  export interface RouteProps {
    path?: string;
    exact?: boolean;
    children?: React.ReactNode;
  }
  
  export interface SwitchProps {
    children?: React.ReactNode;
  }
  
  export interface NavLinkProps {
    to: string;
    activeClassName?: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }
  
  export interface LinkProps {
    to: string;
    children?: React.ReactNode;
  }
  
  export const Route: React.ComponentType<RouteProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const NavLink: React.ComponentType<NavLinkProps>;
  export const Link: React.ComponentType<LinkProps>;
  export const BrowserRouter: React.ComponentType<{ children?: React.ReactNode }>;
  export const useLocation: () => { pathname: string };
  export const useHistory: () => { push: (path: string) => void; goBack: () => void };
  export const useParams: () => { [key: string]: string };
  export const useRouteMatch: (path?: string) => { path: string; url: string };
} 