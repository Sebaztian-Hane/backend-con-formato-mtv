import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import es_ES from "antd/lib/locale/es_ES"; // Locale en español
import dayjs from "dayjs";


const CustomTimeFilter = ({
    onDateChange,
    size = "large",
    style = {},
}) => {
    const [selectDate, setSelectDate] = useState(dayjs);
    const handleDateChange = (date) => {
        setSelectDate(date);
        const formattedDate = date.format('YYYY-MM-DD');
        onDateChange(formattedDate);
    };

    return (
    <ConfigProvider
        locale={es_ES}
        theme={{
            components: {
                DatePicker: {
                    colorTextPlaceholder: "#AAAAAA",
                    colorBgContainer: "#333333",
                    colorText: "#FFFFFF",
                    colorBorder: "#444444",
                    borderRadius: 4,
                    hoverBorderColor: "#555555",
                    activeBorderColor: "#00AA55",
                    colorIcon: "#FFFFFF",
                    colorIconHover:'#00AA55',
                    colorBgElevated: '#121212',
                    colorPrimary: '#00AA55',
                    colorTextDisabled: '#333333',
                    colorTextHeading:'#FFFFFF',
                    cellHoverBg:'#00AA55',
                    colorSplit:'#444444',
                },
            },
        }}
    >
        <DatePicker
                size={size}
                onChange={handleDateChange}
                value={selectDate}
                style={{
                    width: '200px',
                    boxShadow: "none",
                    ...style,
                }}
                placeholder="Filtrar fecha"
            />
        </ConfigProvider>
    );
};

export default CustomTimeFilter;
