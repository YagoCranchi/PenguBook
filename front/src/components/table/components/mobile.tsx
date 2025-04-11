import React from 'react';

interface TableMobileProps {
    headers: string[];
    data: Array<Record<string, any>>;
    renderRow?: (row: Record<string, any>, rowIndex: number) => React.ReactNode;
}

const TableMobile: React.FC<TableMobileProps> = ({ headers, data, renderRow }) => {
    return (
        <div className="table-mobile">
            {data.length ? (
                data.map((row, rowIndex) => (
                    <div key={rowIndex} className="table-mobile__row">
                        {renderRow ? (
                            renderRow(row, rowIndex)
                        ) : (
                            headers.map((header, colIndex) => (
                                <div key={colIndex} className="table-mobile__cell">
                                    <strong>{header}:</strong> {row[header] || ''}
                                </div>
                            ))
                        )}
                    </div>
                ))
            ) : (
                <div className="table-mobile__no-data">Nenhum dado disponível</div>
            )}
        </div>
    );
};

export default TableMobile;