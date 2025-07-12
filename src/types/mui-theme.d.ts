// Type declarations to fix MUI v5 and React 18 compatibility issues
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    breakpoints: {
      up: (key: string | number) => string;
      down: (key: string | number) => string;
      between: (start: string | number, end: string | number) => string;
      only: (key: string) => string;
      not: (key: string) => string;
    };
  }
  
  interface ThemeOptions {
    breakpoints?: {
      up: (key: string | number) => string;
      down: (key: string | number) => string;
      between: (start: string | number, end: string | number) => string;
      only: (key: string) => string;
      not: (key: string) => string;
    };
  }
}

// Fix React Router v5 compatibility with React 18
declare module 'react-router-dom' {
  export interface RouteComponentProps<P = {}, S = {}, H = History.PoorMansHistory> {
    history: H;
    location: H.Location<S>;
    match: match<P>;
    staticContext?: S;
  }

  export interface RouteProps {
    location?: H.Location;
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    children?: ((props: RouteComponentProps<any>) => React.ReactNode) | React.ReactNode;
    path?: string | string[];
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
  }

  export interface SwitchProps {
    location?: H.Location;
    children?: React.ReactNode;
  }

  export function useHistory(): H.History;
  export function useLocation(): H.Location;
  export function useParams<P = {}>(): P;
  export function useRouteMatch<P = {}>(): match<P>;
}

// Fix React Redux Provider compatibility
declare module 'react-redux' {
  export interface ProviderProps {
    store: any;
    children?: React.ReactNode;
  }
}

// Global type augmentations
declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Add any custom attributes here
    }
  }
} 
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    breakpoints: {
      up: (key: string | number) => string;
      down: (key: string | number) => string;
      between: (start: string | number, end: string | number) => string;
      only: (key: string) => string;
      not: (key: string) => string;
    };
  }
  
  interface ThemeOptions {
    breakpoints?: {
      up: (key: string | number) => string;
      down: (key: string | number) => string;
      between: (start: string | number, end: string | number) => string;
      only: (key: string) => string;
      not: (key: string) => string;
    };
  }
}

// Fix React Router v5 compatibility with React 18
declare module 'react-router-dom' {
  export interface RouteComponentProps<P = {}, S = {}, H = History.PoorMansHistory> {
    history: H;
    location: H.Location<S>;
    match: match<P>;
    staticContext?: S;
  }

  export interface RouteProps {
    location?: H.Location;
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    children?: ((props: RouteComponentProps<any>) => React.ReactNode) | React.ReactNode;
    path?: string | string[];
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
  }

  export interface SwitchProps {
    location?: H.Location;
    children?: React.ReactNode;
  }

  export function useHistory(): H.History;
  export function useLocation(): H.Location;
  export function useParams<P = {}>(): P;
  export function useRouteMatch<P = {}>(): match<P>;
}

// Fix React Redux Provider compatibility
declare module 'react-redux' {
  export interface ProviderProps {
    store: any;
    children?: React.ReactNode;
  }
}

// Global type augmentations
declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Add any custom attributes here
    }
  }
} 