import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useUser } from '../../../Context/UserContext';

interface LoginFormData {
    userid: number;
    password: string;
}

export const initValues: Partial<LoginFormData> = {
    userid: 8,
    password: 'password',
};

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loginUser } = useUser();

    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values: LoginFormData) => {
        setLoading(true);
        try {
            await loginUser({ userid: values.userid, password: values.password });
            navigate('/');
        } catch (err: any) {
            // Determine actual error message from your request library:
            // e.g. axios: err.response.data.message
            const backendMessage = err.message || err.response?.data?.message || '';

            // If it’s the “school on null” error, show the custom advisor/student notice
            if (backendMessage.includes('Attempt to read property "school" on null')) {
                notificationController.error({
                    message: 'You attempted to login as student, login in as advisor first to access students!',
                });
            } else {
                // Fallback to the original error
                notificationController.error({ message: backendMessage });
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Auth.FormWrapper>
            <BaseForm
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
                initialValues={initValues}
            >
                <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
                <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>

                <Auth.FormItem
                    name="userid"
                    label={t('common.id')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Auth.FormInput
                        type="number"
                        placeholder={t('common.id')}
                    />
                </Auth.FormItem>

                <Auth.FormItem
                    name="password"
                    label={t('common.password')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Auth.FormInputPassword placeholder={t('common.password')} />
                </Auth.FormItem>

                <Auth.ActionsWrapper>
                    <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
                        <Auth.FormCheckbox>
                            <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
                        </Auth.FormCheckbox>
                    </BaseForm.Item>
                    <Link to="/auth/forgot-password">
                        <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
                    </Link>
                </Auth.ActionsWrapper>

                <BaseForm.Item noStyle>
                    <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
                        {t('common.login')}
                    </Auth.SubmitButton>
                </BaseForm.Item>
            </BaseForm>
        </Auth.FormWrapper>
    );
};
