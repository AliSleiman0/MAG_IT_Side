import React from 'react';
import { Col, Space, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useResponsive } from '../hooks/useResponsive';

type BannerProps = {
    color?: {
        background: string;
        icon: string;
    };
    text: string;
};

const Banner: React.FC<BannerProps> = ({
    color = { background: '#fae3e3', icon: '#f76565' },
    text
}) => {
    const { mobileOnly } = useResponsive();
    const bannerStyles = {
        banner: {
            backgroundColor: color.background,
        
            padding:'16px 24px',
            borderRadius: '8px',
            width: '100%' as const,
        },
        icon: {
            fontSize: mobileOnly ? '12px' : '15px',
            color: color.icon,
        },
        text: {
            fontSize: mobileOnly ? '10px' : '13px',
            color: '#262626',
        }
    };

    return (
        <Col style={bannerStyles.banner}>
            <Space align="center" style={{padding:"10px"} }>
                <InfoCircleOutlined style={bannerStyles.icon} />
                <Typography.Text style={bannerStyles.text}>
                    {text}
                </Typography.Text>
            </Space>
        </Col>
    );
};

export default Banner;