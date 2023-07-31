import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import Stripe from "@/components/stripe"; 
import Summer from "@/components/summer";

export default function Home() {
  const {data: session} = useSession();
  return <Layout>
    <Stripe />
<Summer />

  </Layout>
}
