import React from 'react';
import './index.scss';

interface TableProps {
    headers: string[];
    data: Array<Record<string, any>>;
    renderRow?: (row: Record<string, any>, rowIndex: number) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
    return (
        <table className="table">
            <thead className="table__header">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="table__header-cell">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="table__body">
                {data.map((row, rowIndex) =>
                    renderRow ? (
                        renderRow(row, rowIndex)
                    ) : (
                        <tr key={rowIndex} className="table__body__row">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="cell">
                                    {row[header] || ''}
                                </td>
                            ))}
                        </tr>
                    )
                )}
                {!data.length && (
                    <tr className="table__body__row">
                        <td colSpan={headers.length} className="table__no-data">
                            Nenhum dado disponível
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;