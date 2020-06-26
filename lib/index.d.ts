#!/usr/bin/env node
declare const chalk: any;
declare const figlet: any;
declare const path: any;
declare const program: any;
declare const axios: any;
declare const fs: any;
declare const publicApiEndpoint = "http://{tenant}.phrases.wildlabs.io/pub-api/translations/{projectId}?platformIds[]={platformId}";
declare let url: string;
declare function typescriptEnum(response: any, path: string): void;
declare function json(response: any, path: string): void;
