import React from 'react';
import { Button, ButtonProps } from 'antd';
import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import { useResponsive } from '../hooks/useResponsive';

type DaysButtonProps = {
    icon?: React.ReactElement<IconBaseProps>;
    text: string;
    onClick: () => void;
    isSelected?: boolean;
} & ButtonProps;

const DaysButton: React.FC<DaysButtonProps> = ({
    icon,
    text,
    onClick,
    isSelected = false,
    ...buttonProps
}) => {
    const { mobileOnly } = useResponsive();

    const baseStyle = {
        backgroundColor: isSelected ? '#038b94' : '#e3faf8',
        border: '1px solid #038b94',
        color: isSelected ? '#fff' : '#038b94',
        display: 'flex',
        alignItems: 'center',
        gap: mobileOnly ? '4px' : '8px',
        transition: 'all 0.3s ease',
        fontSize: mobileOnly ? '10px' : '12px',
        height: 'auto',
        borderRadius: "25px",
        padding: "7px",
        boxShadow: 'none'
    };

    const hoverStyle = {
        backgroundColor: '#038b94',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    };

    return (
        <Button
            {...buttonProps}
            style={baseStyle}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.color = hoverStyle.color;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = baseStyle.backgroundColor;
                e.currentTarget.style.color = baseStyle.color;
                e.currentTarget.style.boxShadow = baseStyle.boxShadow;
            }}
        >
            {text}
        </Button>
    );
};

export default DaysButton;