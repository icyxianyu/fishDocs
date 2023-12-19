import * as path from "path"


export const ROOTROAD = path.join(__dirname, '..', '..')

export const SRCPATH = path.join(ROOTROAD, 'src')

export const DISTPATH = path.join(ROOTROAD, 'dist');

export const TEMPLATEPATH = path.join(ROOTROAD, 'template.html');

export const CLIENTENTRY = path.join(SRCPATH, 'runtime', 'client-entry.tsx');

export const SERVERENTRY = path.join(SRCPATH, 'runtime', 'server-entry.tsx');