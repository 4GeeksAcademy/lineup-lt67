import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/clients" className="me-2">
						<button className="btn btn-outline-primary">Clientes</button>
					</Link>
					<Link to="/tipos" className="me-2">
						<button className="btn btn-outline-success">Tipos</button>
					</Link>
					<Link to="/establecimientos" className="me-2">
						<button className="btn btn-outline-secondary">Establecimientos</button>
					</Link>
					<Link to="/administradores" className="me-2">
						<button className="btn btn-outline-success">Admins</button>
					</Link>
					<Link to="/tickets" className="me-2">
						<button className="btn btn-outline-success">Tickets</button>
					</Link>
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};