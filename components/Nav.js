import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { BsShop } from 'react-icons/bs';
import { BiShoppingBag } from 'react-icons/bi';
import { BsCart4 } from 'react-icons/bs';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useSession } from "next-auth/react";
import { TbReportMoney } from "react-icons/tb";
import { BsBoxes } from "react-icons/bs";
import { CiShoppingTag } from "react-icons/ci";

export default function Nav() {
  const inactiveLink = 'font-sans font-hairline hover:font-normal text-md text-nav-item no-underline';
  const activeLink = inactiveLink + '  text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + 'text-primary';
  const router = useRouter();
  const { pathname } = router;
  const { data: session } = useSession();

  async function logout() {
    await signOut();
    await router.push('/');
  }

// console.log("here is",  session?.user?.roles)
const isAdmin = session?.user?.roles === "admin"; 

  // const isAdmin = "admin";

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
          <Link href={'/orders'} className={pathname.includes('/orders') ? activeLink : inactiveLink}>
            <BsBoxes />
            Orders
          </Link>
        </li>
        <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/sale'} className={pathname.includes('/sale') ? activeLink : inactiveLink}>
            <BsCart4 />
            Sales
          </Link>
        </li>
        {isAdmin && (
          <>
            <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
              <Link href={'/products'} className={pathname.includes('/products') ? activeLink : inactiveLink}>
              <CiShoppingTag />
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
              <Link href={'/profit'} className={pathname.includes('/profit') ? activeLink : inactiveLink}>
              <TbReportMoney />
                Profit
              </Link>
            </li>
            <li className="w-full pl-4 h-full py-3 px-2 border-b border-light-border">
          <Link href={'/settings'} className={pathname.includes('/settings') ? activeLink : inactiveLink}>
            <FiSettings />
            Settings
          </Link>
        </li>


          </>
        )}
        
       
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
