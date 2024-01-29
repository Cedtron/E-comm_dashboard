import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import UserForm from "@/components/UserForm";

export default function EditUserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/user?id='+id).then(response => {
      setUserInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <div className="bg-grey-darker p-4 text-white">   <h1 className="text-lg text-center">Edit User</h1></div>
      {userInfo && (
        <UserForm {...userInfo} />
      )}
    </Layout>
  );
}