import React from 'react';

import {
    UserOutlined,
    MessageOutlined,
    TeamOutlined,
    DownloadOutlined,
} from '@ant-design/icons';

export interface SidebarNavigationItem {
    title: string;
    key: string;
    url?: string;
    children?: SidebarNavigationItem[];
    icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [

    {
        title: 'Upload POS ',
        key: 'upload_pos',
        // TODO use path variable
        url: '/',
        icon: <DownloadOutlined />,
    },
   
  
];
