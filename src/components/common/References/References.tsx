import React from 'react';
import * as S from './References.styles';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const References: React.FC = () => {
    const { t } = useTranslation();
    return (
        <S.ReferencesWrapper style={{ borderTop: "1px solid #d3f5f1" }}>
            <S.Text>
                {t('footer.f_text1')}{' '}
                <a href="https://github.com/AliSleiman0" target="_blank" rel="noreferrer">
                    Ali{' '}
                </a>
                &{' '}
                <a href="https://github.com/Doaa2024" target="_blank" rel="noreferrer">
                    Doaa{' '}
                </a>
                {t('footer.f_text2')} {new Date().getFullYear()} &copy;{' '}
                {t('footer.f_text3')}{' '}
                <a href="https://ant.design/" target="_blank" rel="noreferrer">
                    Ant Design
                </a>
            </S.Text>
            <S.Icons>
                <a href="https://github.com/AliSleiman0" target="_blank" rel="noreferrer">
                    <GithubOutlined />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <TwitterOutlined />
                </a>
                <a href="https://www.facebook.come" target="_blank" rel="noreferrer">
                    <FacebookOutlined />
                </a>
                <a href="https://linkedin.com/in/AliSleiman11" target="_blank" rel="noreferrer">
                    <LinkedinOutlined />
                </a>
            </S.Icons>
        </S.ReferencesWrapper>
    );
};
