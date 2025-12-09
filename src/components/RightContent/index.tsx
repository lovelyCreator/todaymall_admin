import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';

export type SiderTheme = 'light' | 'dark';

// Custom SelectLang to show only Korean, English, and Chinese
export const SelectLang: React.FC = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
      // Only show these 3 languages
      postLocalesData={(locales) => {
        const allowedLocales = ['ko-KR', 'en-US', 'zh-CN'];
        return locales.filter((locale) => allowedLocales.includes(locale.lang));
      }}
    />
  );
};

export const Question: React.FC = () => {
  return (
    <a
      href="https://pro.ant.design/docs/getting-started"
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        padding: '4px',
        fontSize: '18px',
        color: 'inherit',
      }}
    >
      <QuestionCircleOutlined />
    </a>
  );
};
