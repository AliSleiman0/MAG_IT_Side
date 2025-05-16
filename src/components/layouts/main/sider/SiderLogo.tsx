import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from 'hooks/useResponsive';
import logo from 'assets/logo.png';
import logoMAG from 'assets/logoMAG.png';
import MAGLogo2 from 'assets/MAGLogo2.png';
import logoDark from 'assets/logo-dark.png';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface SiderLogoProps {
    isSiderCollapsed: boolean;
    toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider }) => {
    const { tabletOnly, desktopOnly, mobileOnly } = useResponsive();

    const theme = useAppSelector((state) => state.theme.theme);

    return (
        <S.SiderLogoDiv>
            <S.SiderLogoLink to="/">
                <img src={MAGLogo2} alt="Lightence" width={48} height={48} />
                <S.BrandSpan>MAG</S.BrandSpan>
            </S.SiderLogoLink>
            {(!mobileOnly) &&  (
                <S.CollapseButton
                    shape="circle"
                    size="small"

                    $isCollapsed={isSiderCollapsed}
                    icon={<RightOutlined rotate={isSiderCollapsed ? 0 : 180} />}
                    onClick={toggleSider}
                    style={{ backgroundColor:"#03666f", marginLeft:"20px!important"} }
                />
            )}
        </S.SiderLogoDiv>
    );
};
