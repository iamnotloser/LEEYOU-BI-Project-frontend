import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Leeyou BI',
          title: 'Leeyou BI',
          href: 'https://github.com/iamnotloser',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/iamnotloser',
          blankTarget: true,
        },
        {
          key: 'Leeyou BI',
          title: 'Leeyou BI',
          href: 'https://github.com/iamnotloser',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
