// Type declarations for Deno environment
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }
  
  export const env: Env;
}

declare module 'https://deno.land/std@0.210.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.39.3' {
  export function createClient(url: string, key: string): any;
}

declare module 'https://esm.sh/stripe@13.11.0' {
  export default class Stripe {
    constructor(apiKey: string, options?: any);
    static createFetchHttpClient(): any;
    checkout: {
      sessions: {
        create(options: any): Promise<any>;
      };
    };
  }
} 