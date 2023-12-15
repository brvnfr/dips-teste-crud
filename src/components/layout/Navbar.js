import Logo from '../../assets/images/brand/logo.webp'
import { FaUsers, FaCircleQuestion  } from "react-icons/fa6";

function Navbar ({ show }) {
  return (
    <nav className={show ? 'active' : ''}>
        <img src={Logo} alt='Logo' className='logo' />
        <ul>
            <li>
                <a href='/'>
                  <FaUsers/> Usuarios
                </a>
            </li>
            <li>
                <a href='/sobre'>
                <FaCircleQuestion/> Sobre
                </a>
            </li>
        </ul>
    </nav>
  )
    
 

}

export default Navbar
