import { useEffect, useState } from 'react';
import { Header, PropsWithIsland } from 'shared/types';
import { useHeaders } from '../../useHeaders';

interface AsideProps {
  headers: Header[];
}
export function Aside({ headers = [] }: AsideProps & PropsWithIsland) {
  const asyncHeader = useHeaders(headers);

  const fontSize = (depth) => {
    if (depth === 1) {
      return 'text-2xl font-bold';
    }
    if (depth === 2) {
      return 'text-xl font-bold';
    }
    if (depth === 3) {
      return 'text-lg font-bold';
    }
    if (depth === 4) {
      return 'text-base font-bold';
    } else {
      return 'text-sm  font-bold';
    }
  };

  return (
    <div className="flex flex-col fixed fish-toc">
      {asyncHeader.map((item) => {
        return (
          <div id={item.id} key={item.id} className={fontSize(item.depth)}>
            {item.text}
          </div>
        );
      })}
    </div>
  );
}
