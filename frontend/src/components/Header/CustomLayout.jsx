import React from 'react';
import { Layout } from 'antd';
import CustomHeader from './Header';

const { Sider, Content } = Layout;

const CustomLayout = ({ title , isBack }) => {
  return (
    <>
      <CustomHeader title={title} isBack={isBack}/>
    </>
  );
};

export default CustomLayout;
