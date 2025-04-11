import React from 'react';
import TableDesktop from './components/deskptop';
import TableMobile from './components/mobile';
import { useMediaQuery } from '../../hooks/useMediaQuery';

import './index.scss';

interface TableProps {
    headers: string[];
    data: Array<Record<string, any>>;
    renderRow?: (row: Record<string, any>, rowIndex: number) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return isMobile ? (
        <TableMobile headers={headers} data={data} renderRow={renderRow} />
    ) : (
        <TableDesktop headers={headers} data={data} renderRow={renderRow} />
    );
};

export default Table;