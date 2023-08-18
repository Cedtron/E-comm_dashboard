import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { BsShop } from 'react-icons/bs';
import { BiShoppingBag } from 'react-icons/bi';
import { BsCart4 } from 'react-icons/bs';
import { FiSettings, FiLogOut } from 'react-icons/fi';

export default function Nav() {
  const inactiveLink = 'font-sans font-hairline hover:font-normal text-md text-nav-item no-underline';
  const activeLink = inactiveLink + '  text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + 'text-primary';
  const router = useRouter();
  const { pathname } = router;

  async function logout() {
    await signOut();
    await router.push('/');
  }
 

  return (
    <aside id="sidebar" className="bg-blue-600 text-white w-1/2 md:w-1/6 lg:w-1/6 border-r object-top border-side-nav hidden md:block lg:block">
  
    
    <ul className="list-reset flex flex-col">
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
          <BsShop />
              Dashboard
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
              <BsShop />
              Products
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/categories'} className={pathname.includes('/categories') ? activeLink : inactiveLink}>
              <BiShoppingBag />
              Categories
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
              <BsCart4 />
              Orders
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/sale'} className={pathname.includes('/sale') ? activeLink : inactiveLink}>
              <BsCart4 />
              Sales
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/settings'} className={pathname.includes('/settings') ? activeLink : inactiveLink}>
              <FiSettings />
              Settings
              
            
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 ">
          <button onClick={logout} className="bg-white py-2 px-4 rounded-lg text-black w-full">
            <FiLogOut />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
