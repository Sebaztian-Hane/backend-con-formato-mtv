import React from "react";
import { Pagination, ConfigProvider } from "antd";

const ModeloPagination = ({ total, current, pageSize, onChange }) => {
    const handleChange = (page, size) => {
        onChange(page, size);
    };
    
    
    return (
        <ConfigProvider
            theme={{
                components: {
                    Pagination: {
                        itemActiveBg: '#0066FF',
                        itemBg: '#333333',
                        colorText: '#fff',
                        colorPrimary: '#fff',
                        colorTextDisabled: '#707070',
                        fontFamily: 'Arial',
                        fontSize: '14px',
                        colorBorder: 'none'
                    },
                },
            }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    marginTop: '20px',
                }}
            >
                <div
                    style={{
                        background: '#272727',
                        //padding: '5px',
                        borderRadius: '10px',
                        display: 'inline-block',
                    }}
                >
                    <Pagination
                        showSizeChanger={false}
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        onChange={handleChange}
                        
                    />
                </div>
                <div style={{ color: '#555555', marginTop: '10px' }}>
                    50 / página
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ModeloPagination;