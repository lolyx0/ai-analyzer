import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar relative z-10">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">CVision</p>
            </Link>
            <div className="relative">
                <Link to="/upload" className="fancy-btn">
                    <span>Upload Resume</span>
                </Link>
            </div>

        </nav>

    )
}
export default Navbar