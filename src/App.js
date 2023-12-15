import { useState } from 'react'
import './App.css';
import Navbar from './components/layout/Navbar'
import Users  from './pages/users'
import About  from './pages/about'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import Logo from './assets/images/brand/logo.webp'



function App() {
	const [ showNav, setShowNav ] = useState(false) // Controle de visibilidade da Sidebar

  return (
		<>
			
			<header>
				<img src={Logo} alt='Logo' className='logo' />
				<GiHamburgerMenu onClick={()=> setShowNav(!showNav)} /> 
			</header>

			 <Navbar show={showNav} />

		{/*Roteamento de paginas */}
			 <div className="main">
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Users/>}/>
							<Route path="/sobre" element={<About/>}/>
						</Routes>
					</BrowserRouter>
			 </div>
    </>
  );
}

export default App;
