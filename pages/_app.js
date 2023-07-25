import '@/styles/globals.css';
// import 'bootstrap/dist/css/bootstrap.css';
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack"

export default function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    
    <SessionProvider session={session}>
      <SnackbarProvider>
        <Component {...pageProps}/>
     </SnackbarProvider>
     </SessionProvider>
   
  )
} 