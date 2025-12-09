// Temporary test file - delete after testing
import { useIntl } from '@umijs/max';

export default function TestMenuI18n() {
  const intl = useIntl();
  
  return (
    <div style={{ padding: 20 }}>
      <h2>Menu i18n Test</h2>
      <p>Current Locale: {intl.locale}</p>
      
      <h3>Parent Menu:</h3>
      <p>menu.products: {intl.formatMessage({ id: 'menu.products' })}</p>
      
      <h3>Submenu Items:</h3>
      <p>menu.products.list: {intl.formatMessage({ id: 'menu.products.list' })}</p>
      <p>menu.products.add: {intl.formatMessage({ id: 'menu.products.add' })}</p>
      <p>menu.products.categories: {intl.formatMessage({ id: 'menu.products.categories' })}</p>
      <p>menu.products.import-taobao: {intl.formatMessage({ id: 'menu.products.import-taobao' })}</p>
    </div>
  );
}
