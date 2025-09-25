import { Link } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { MainNav } from './MainNav';
import { ParametreMenu } from './ParametreMenu';
import CartDropdown from './CartDropdown';

const Header = () => {
  return (
    <div className="border-b-2 border-b-gray-300 py-6">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-black hover:text-gray-500">MyApp</Link>
            <div className="flex items-center gap-4 md:hidden"> 
              <CartDropdown />
              <Link to="/shop" className="flex items-center gap-2 font-bold hover:text-gray-500">
                    MAGASIN
              </Link>           
              <div className='flex items-center gap-4 md:hidden'>                               
                  <MobileNav />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/shop" className="flex items-center gap-2 font-semibold text-xl hover:text-gray-500">
                    Magasin
              </Link>
              <CartDropdown />                                       
              <MainNav />
              <ParametreMenu />
            </div>
        </div>
    </div>
  )
}

export default Header