import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';
import { useLogin } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const loginMutation = useLogin();

  const handleSubmit = async (values: { email: string; password: string }) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        background: '#f5f7fa',
      }}
    >
      {/* 왼쪽 이미지 */}
      <div
        style={{
          flex: 1,
          background: `url('https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
          position: 'relative',
          minWidth: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(30,10,60,0.8), rgba(90,40,120,0.6))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(60px, 10vw, 100px)',
                fontWeight: 900,
                letterSpacing: '-2px',
                background: 'linear-gradient(90deg, #ff4d4f, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TodayMall
            </h1>
            <p
              style={{
                margin: '24px 0 0',
                fontSize: '28px',
                fontWeight: 300,
                opacity: 0.9,
              }}
            >
              관리자 센터
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 - 로고 완전 업그레이드 */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* TodayMall 전용 로고 */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #722ed1, #ff4d4f)',
                width: 96,
                height: 96,
                borderRadius: '50%',
                marginBottom: 24,
                boxShadow: '0 12px 30px rgba(114, 46, 209, 0.3)',
              }}
            >
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: -2,
                }}
              >
                T
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#fff',
                  marginLeft: -8,
                }}
              >
                E
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 800,
                background: 'linear-gradient(90deg, #722ed1, #ff4d4f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TodayMall
            </h2>
            <p style={{ margin: '8px 0 0', color: '#888', fontSize: 16 }}>
              관리자 시스템
            </p>
          </div>

          <LoginForm
            logo={null}
            title=""
            subTitle=""
            onFinish={handleSubmit}
            submitter={{
              searchConfig: {
                submitText: '로그인',
              },
              submitButtonProps: {
                size: 'large',
                block: true,
                loading: loginMutation.isPending,
                disabled: loginMutation.isPending,
                style: {
                  height: 56,
                  fontSize: 18,
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #722ed1, #ff4d4f)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 8px 20px rgba(114, 46, 209, 0.3)',
                },
              },
            }}
          >
            <ProFormText
              name="email"
              fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
              placeholder="이메일 주소"
              rules={[
                { required: true, message: '이메일을 입력하세요' },
                { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
              ]}
            />
            <div style={{ height: 16 }} />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
              placeholder="비밀번호"
              rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
            />
            <div style={{ margin: '24px 0' }}>
              <ProFormCheckbox name="autoLogin">로그인 상태 유지</ProFormCheckbox>
              <a style={{ float: 'right', color: '#722ed1' }}>
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </LoginForm>

          <div
            style={{
              textAlign: 'center',
              marginTop: 60,
              color: '#bbb',
              fontSize: 13,
            }}
          >
            © 2025 TodayMall Co., Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
