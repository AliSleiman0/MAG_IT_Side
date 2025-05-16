import React from 'react';
import { Button, ButtonProps } from 'antd';

import { IconBaseProps } from '@ant-design/icons/lib/components/Icon'; // For Ant Design Icons
import { useResponsive } from '../hooks/useResponsive';

type IconButtonProps = {
    icon?: React.ReactElement< IconBaseProps>;
    text: string;
    onClick: () => void;
    type?: string;
} & ButtonProps;

const IconButton: React.FC<IconButtonProps> = ({ icon, text, onClick, type, ...buttonProps }) => {
    const { mobileOnly } = useResponsive();
    return (
        <Button
            style={{
                backgroundColor: '#e3faf8',
                border: '1px solid #038b94',
                color: '#038b94',
                display: 'flex',
                alignItems: 'center',
                gap: mobileOnly ? '4px' : '8px',
                transition: 'all 0.3s ease',
                fontSize: mobileOnly ? '10px' : '12px',
                height: 'auto',  
            }}
            onClick={onClick }
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#038b94';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e3faf8';
                e.currentTarget.style.color = '#038b94';
                e.currentTarget.style.boxShadow = 'none';
            }}
            {...buttonProps}
        >
            {icon && React.cloneElement(icon, { style: { fontSize: mobileOnly ? '12px' : '14px' } })}
            {text}
        </Button>
    );
};

export default IconButton;