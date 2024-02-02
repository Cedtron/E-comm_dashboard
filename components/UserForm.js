import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useSnackbar } from 'notistack';
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";
 
export default function UserForm({
  _id,
  name:existingName,
  email:existingEmail,
  password:existingPassword,
  passhint:existingPasshint,
  role: existingRole,

  images:existingImages,

}) {
  const [name,setName] = useState(existingName || '');
  const [email,setEmail] = useState(existingEmail || '');
  const [role,setRole] = useState(existingRole || '');
  const [password,setPassword] = useState(existingPassword || '');
  const [passhint,setPasshint] = useState(existingPasshint || '');
  const [goToUsers,setGoToUsers] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [swalProps, setSwalProps]= useState({});

  async function saveUser(ev) {
    ev.preventDefault();
    const data = {
      name,email,password,role,passhint
    };
    if (_id) {
      //update
      await axios.put('/api/user', {...data,_id})
      .then((data) => {
        setSwalProps({
          show:true,
          title:  'User successfully Update',
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
      <form onSubmit={saveUser} className="mx-auto">
      <div className="sm:col-span-3 my-4">
              <label htmlFor="User-name" className="block text-sm font-medium leading-6 text-gray-900">
      User name</label>
      <div className="mt-2">
        <input
          className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="User name"
          value={name}
          onChange={ev => setName(ev.target.value)}/>
          </div>
          </div>

          <div className="sm:col-span-3 my-4">
              <label htmlFor="User-name" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div className="mt-2">
        <input
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Email"
          value={email}
          onChange={ev => setEmail(ev.target.value)}/>
           </div></div>

           <div className="sm:col-span-3 my-4">
              <label htmlFor="User-name" className="block text-sm font-medium leading-6 text-gray-900">Role</label>
          <div className="mt-2">
        <select value={role}    className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              
                onChange={ev => setRole(ev.target.value)}>
          <option value="">Choose Role</option>
      
            <option  value="admin">Admin</option>
            <option  value="saler">Saler</option>
        </select>
        </div>
        </div>
        <div className="sm:col-span-3 my-4">
              <label htmlFor="User-name" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
        <div className="mt-2">
        <input
         className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Password name"
          value={password}
          onChange={ev => setPassword(ev.target.value)}/>
          </div>
          </div>

          <div className="sm:col-span-3 my-4">
              <label htmlFor="User-name" className="block text-sm font-medium leading-6 text-gray-900">Password Hint</label>
          <div className="mt-2">
        <input
        className="block w-2/3 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          placeholder="Password hint"
          value={passhint}
          onChange={ev => setPasshint(ev.target.value)}/>
           </div></div>

        <button
          type="submit"
          className="bg-blue-400 rounded-md p-2 mt-4 text-white w-1/5">
          Save
        </button>
       
      </form>
      </div>
   
      </div>
  );
}
