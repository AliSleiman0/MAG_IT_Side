import React, { useMemo } from 'react';
import { Overlay } from '../../../../common/Overlay/Overlay';
import { useResponsive } from 'hooks/useResponsive';
import * as S from './MainSider.styles';
import { SiderLogo } from '../SiderLogo';
import SiderMenu from '../SiderMenu/SiderMenu';

interface MainSiderProps {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const MainSider: React.FC<MainSiderProps> = ({ isCollapsed, setCollapsed, ...props }) => {
    const { isDesktop, desktopOnly, isTablet, mobileOnly, tabletOnly } = useResponsive();

    const isCollapsible = useMemo(() => !isDesktop, [isDesktop]);

    const toggleSider = () => setCollapsed(!isCollapsed);

    return (
        <>
          
                <S.Sider
                    trigger={null}
                    collapsed={isCollapsed}
                    collapsedWidth={mobileOnly ? 0 : 80}
                    collapsible={isCollapsible}
                    width={260}
                    {...props}
                >
                    <SiderLogo isSiderCollapsed={isCollapsed} toggleSider={toggleSider} />
                    <S.SiderContent>
                        <SiderMenu setCollapsed={setCollapsed} />
                    </S.SiderContent>
                </S.Sider>
             
            {mobileOnly && <Overlay onClick={toggleSider} show={!isCollapsed} />}
           
    </>
  );
};

export default MainSider;
