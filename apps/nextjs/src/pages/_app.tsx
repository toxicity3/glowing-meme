import '../styles/globals.css';
import type { AppType } from 'next/app';
import { ptBR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { api } from '~/utils/api';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider
      localization={ptBR}
      appearance={{ baseTheme: dark }}
      {...pageProps}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
