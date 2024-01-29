import UserForm from "@/components/UserForm";
import Layout from "@/components/Layout";

export default function NewUser() {
  return (
    <Layout>
      <div className="bg-grey-darker p-4 text-white">   <h1 className="text-lg text-center">New User</h1></div>
      <UserForm />
    </Layout>
  );
}