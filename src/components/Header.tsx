import { Link } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { MainNav } from './MainNav';
import { ParametreMenu } from './ParametreMenu';
import CartDropdown from './CartDropdown';

const Header = () => {
  return (
    <header className="modern-black-card border-l-0 border-r-0 border-t-0 rounded-none sticky top-0 z-50 py-4">
        <div className="app-container flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight title-clickable">
                MyApp
            </Link>
            <div className="flex items-center gap-4 md:hidden"> 
              <CartDropdown />
              <Link to="/shop" className="flex items-center gap-2 font-semibold title-clickable">
                    Magasin
              </Link>           
              <div className='flex items-center gap-4 md:hidden'>                               
                  <MobileNav />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="flex items-center gap-2 font-semibold text-lg title-clickable">
                    Magasin
              </Link>
              <CartDropdown />                                       
              <MainNav />
              <ParametreMenu />
            </div>
        </div>
    </header>
  )
}

export default Header