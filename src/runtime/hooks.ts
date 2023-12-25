import { createContext, useContext } from 'react';
import { PageData } from 'shared/types';

export const PagtContext = createContext<PageData>({} as PageData);

export const usePageData = () => useContext(PagtContext);
