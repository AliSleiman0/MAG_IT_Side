import React from 'react';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { NightModeSettings } from '../nightModeSettings/NightModeSettings';
import { ThemePicker } from '../ThemePicker/ThemePicker';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from './SettingsOverlay.styles';

export const SettingsOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();

  const { isPWASupported, event } = useAppSelector((state) => state.pwa);

  return (
    <S.SettingsOverlayMenu {...props}>
      <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
        <DropdownCollapse.Panel header={t('common.change_lang')} key="languagePicker">
          <LanguagePicker />
        </DropdownCollapse.Panel>
              <DropdownCollapse.Panel header={t('common.change_theme')} key="themePicker">
          <ThemePicker />
        </DropdownCollapse.Panel>
       
      </DropdownCollapse>
      
    </S.SettingsOverlayMenu>
  );
};
