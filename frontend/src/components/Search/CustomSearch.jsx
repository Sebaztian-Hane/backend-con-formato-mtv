import React from "react";
import { Input, ConfigProvider } from "antd";

const CustomSearch = ({
    placeholder = "Buscar...",  
    onSearch,                      
    size = "large",
    width = "400px",          
    style = {},               
}) => {
    const handleChange = (e) => {
        onSearch(e.target.value);
    };


    return (
        <ConfigProvider
        theme={{
            components: {
            Input: {
                colorTextPlaceholder: "#AAAAAA", 
                colorBgContainer: "#333333",    
                colorText: "#FFFFFF",           
                colorBorder: "#444444",         
                borderRadius: 4,                
                hoverBorderColor: "#555555",    
                activeBorderColor: "#00AA55",  
            },
            },
        }}
        >
        <Input
            placeholder={placeholder}
            size={size}
            onChange={handleChange} 
            style={{ 
            width,
            boxShadow: "none",
            ...style 
            }}
        />
        </ConfigProvider>
    );
};

export default CustomSearch;