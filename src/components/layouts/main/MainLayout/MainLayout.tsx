import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation } from 'react-router-dom';

import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';

const MainLayout: React.FC = () => {
    const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
    const [siderCollapsed, setSiderCollapsed] = useState(true);
    const { isDesktop } = useResponsive();
    const location = useLocation();

    const toggleSider = () => setSiderCollapsed(!siderCollapsed);



    return (
        <S.LayoutMaster >
            <MainSider  isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
            <S.LayoutMain>
                <MainHeader isTwoColumnsLayout={false}>
                    <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={false} />
                </MainHeader>
                <MainContent id="main-content" $isTwoColumnsLayout={false}>
                    <div>
                        <Outlet />
                    </div>
                    {!isTwoColumnsLayout && <References />}
                </MainContent>
            </S.LayoutMain>
        </S.LayoutMaster>
    );
};

export default MainLayout;
