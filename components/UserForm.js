import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import { useSnackbar } from 'notistack';
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function UserForm({
  _id,
  name:existingName,
  email:existingEmail,
  password:existingPassword,
  role: existingRole,

  images:existingImages,

}) {
  const [name,setName] = useState(existingName || '');
  const [email,setEmail] = useState(existingEmail || '');
  const [role,setRole] = useState(existingRole || '');
  const [password,setPassword] = useState(existingPassword || '');
  const [goToUsers,setGoToUsers] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [swalProps, setSwalProps]= useState({});

  async function saveUser(ev) {
    ev.preventDefault();
    const data = {
      name,email,password,role
    };
    if (_id) {
      //update
      await axios.put('/api/user', {...data,_id})
      .then((data) => {
        setSwalProps({
   show:true,
   Nam: 'User successfully Update',
text:'Done',
 })
}) .catch((error) => {
 enqueueSnackbar(error, { variant: 'error' });
});
    } else { 
      //create
      await axios.post('/api/user', data)
      .then((data) => {
               setSwalProps({
          show:true,
          title: 'User successfully Added',
    text:'Done',
        })
      }) .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
      });
    }
    setGoToUsers(true);
  }
  if (goToUsers) {
    router.push('/settings');
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  function setUserProp(propName,value) {
    setUserProperties(prev => {
      const newUserProps = {...prev};
      newUserProps[propName] = value;
      return newUserProps;
    });
  }



  return (
    <div className="bg-white text-black mx-auto rounded overflow-hidden shadow-lg w-full">

    <div className="p-4 text-black  -mt-2.5 -mb-2.5 -ml-2.5 -mr-2.5">
      <form onSubmit={saveUser}>
        <label>User name</label>
        <div className="space-x-2 >*">
        <input
        className=" w-1/2 h-8 p-2 rounded-md"
          type="text"
          placeholder="User name"
          value={name}
          onChange={ev => setName(ev.target.value)}/>
          </div>
          <label>Email</label>
        <div className="space-x-2 >*">
        <input
        className=" w-1/2 h-8 p-2 rounded-md"
          type="text"
          placeholder="Email"
          value={email}
          onChange={ev => setEmail(ev.target.value)}/>
          </div>
          <label>Role</label>
        <div className="space-x-2 >*">
        <select value={role} className=" w-1/2 h-10 p-2 rounded-md"
                onChange={ev => setRole(ev.target.value)}>
          <option value="">Choose Role</option>
      
            <option  value="admin">Admin</option>
            <option  value="saler">Saler</option>
        </select>
        </div>
   
        <label>Password</label>
        <div className="space-x-2 >*">
        <input
        className=" w-1/2 h-8 p-2 rounded-md"
          type="text"
          placeholder="Password name"
          value={password}
          onChange={ev => setPassword(ev.target.value)}/>
          </div>


        <button
          type="submit"
          className="bg-blue-400 rounded-md p-2 text-white w-1/5">
          Save
        </button>
      </form>
      </div>
      <SweetAlert2 {...swalProps}/>
      </div>
  );
}
