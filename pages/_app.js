import '@/styles/globals.css';
import 'sweetalert2/src/sweetalert2.scss'
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack"
import { CartContextProvider } from '@/components/context';

export default function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    
    <SessionProvider session={session}>
      <CartContextProvider>
      <SnackbarProvider>
        <Component {...pageProps}/>
     </SnackbarProvider>
     </CartContextProvider>
     </SessionProvider>
   
  )
} 