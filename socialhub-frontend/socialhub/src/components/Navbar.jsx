import { Link, NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="site-nav">
            <Link className="brand" to="/">
                <span className="brand-mark">S</span>
                <span>Social<span>Hub</span></span>
            </Link>
            <div className="nav-links">
                <NavLink end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
                    Dashboard
                </NavLink>
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/posts">
                    Posts
                </NavLink>
                <NavLink className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`} to="/posts/new">
                    Nueva publicación <span>+</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;