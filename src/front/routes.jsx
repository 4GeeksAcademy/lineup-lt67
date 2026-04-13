// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Clientes } from "./pages/Clientes";
import { ClientForm } from "./pages/ClientForm";
import { EditClient } from "./pages/EditClient";
import { ClientLogin } from "./pages/ClientLogin";
import { Tipos } from "./pages/Tipos";
import { TipoForm } from "./pages/TipoForm";
import { EditTipo } from "./pages/EditTipo";
import {Administradores} from "./pages/Administradores";
import { TipoDetail } from "./pages/TipoDetail";
import { AdminForm } from "./pages/AdminForm";
import { EditAdmin } from "./pages/EditAdmin";
import { AdminDetail } from "./pages/AdminDetail"
import { ClientDetail } from "./pages/ClientDetail";
import { Favoritos } from "./pages/Favoritos";
import { AdminLogin } from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

import { Establecimientos } from "./pages/EstablecimientosCRUD/Establecimientos";
import { EstablecimientoForm } from "./pages/EstablecimientosCRUD/EstablecimientoForm";
import { EstablecimientoEdit } from "./pages/EstablecimientosCRUD/EstablecimientoEdit";
import { EstablecimientoDetail } from "./pages/EstablecimientosCRUD/EstablecimientoDetail";
import { EstablecimientoLogin } from "./pages/EstablecimientosCRUD/EstablecimientoLogin"
import { EstablecimientoDashboard } from "./pages/EstablecimientosCRUD/EstablecimientoDashboard"
import { ProtectedRouteEstablecimiento } from "./components/ProtectedRouteEstablecimiento";

import { SucursalForm } from "./pages/EstablecimientosCRUD/SucursalForm";
import { SucursalEdit } from "./pages/EstablecimientosCRUD/SucursalEdit"
import { SucursalDashboard } from "./pages/EstablecimientosCRUD/SucursalDashboard"

import { ProtectedRouteClient } from "./components/ProtectedRouteClient";

import { Tickets } from "./pages/TicketsCRUD/Tickets";
import { TicketForm } from "./pages/TicketsCRUD/TicketForm";
import { TicketDetail } from "./pages/TicketsCRUD/TicketDetail";
import { TicketEdit } from "./pages/TicketsCRUD/TicketEdit";

import { Servicios } from "./pages/ServiciosCRUD/Servicios";
import { ServicioForm } from "./pages/ServiciosCRUD/ServicioForm";
import { ServicioDetail } from "./pages/ServiciosCRUD/ServicioDetail";
import { ServicioEdit } from "./pages/ServiciosCRUD/ServicioEdit";

import { Liners } from "./pages/Liners"
import { AddLiner } from "./pages/AddLiner"
import { EditLiner } from "./pages/EditLiner"
import { LinerDetail } from "./pages/LinerDetail"
import { LinerLogin } from "./pages/LinerLogin"
import { LinerRegister } from "./pages/LinerRegister"
import { LinerHome } from "./pages/LinerHome"
import { ProtectedRouteLiner } from "./components/ProtectedRouteLiner"

import { Propuestas } from "./pages/PropuestasCRUD/Propuestas";
import { PropuestaForm } from "./pages/PropuestasCRUD/PropuestaForm";
import { PropuestaDetail } from "./pages/PropuestasCRUD/PropuestaDetail";
import { PropuestaEdit } from "./pages/PropuestasCRUD/PropuestaEdit";

import { ClientRegister } from "./pages/ClientRegister"
import { ClientHome } from "./pages/ClientHome";
import { ClientTickets } from "./pages/ClientTickets"
import { ClientServices } from "./pages/ClientServices";
import { ClientServiceForm } from "./pages/ClientServiceForm";
import { ClientServiceDetail } from "./pages/ClientServiceDetail";

import { SimpleMap } from "./pages/SimpleMap";



export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
        <Route errorElement={<h1>Not found!</h1>}>

          <Route path="/establecimiento/login" element={<EstablecimientoLogin />} />
          <Route path="/establecimiento" element={<Navigate to="/establecimiento/login" replace />} />
          <Route element={<ProtectedRouteEstablecimiento />}>
            <Route path="/establecimiento/dashboard" element={<EstablecimientoDashboard />} />
            <Route path="/establecimientos/:id/detalle" element={<EstablecimientoDetail />} />
            <Route path="/establecimientos/:id" element={<EstablecimientoEdit />} />
            <Route path="/establecimiento/sucursal/edit/:id" element={<SucursalEdit />} />
            <Route path="/establecimiento/sucursal/:id" element={<SucursalDashboard />} />
            <Route path="/add_establecimiento" element={<EstablecimientoForm />} />
            <Route path="/sucursal/nueva" element={<SucursalForm />} />
          </Route>

        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/single/:theId" element={<Single />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/liner/login" element={<LinerLogin />} />
          <Route path="/liner/register" element={<LinerRegister />} />
          <Route path="/simplemap" element={<SimpleMap />} />
          <Route path="/establecimientos" element={<Establecimientos />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/clients" element={<Clientes />} />
            <Route path="/add_client" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/edit/:id" element={<EditClient />} />
            <Route path="/tipos" element={<Tipos />} />
            <Route path="/add_tipo" element={<TipoForm />} />
            <Route path="/tipos/:id" element={<TipoDetail />} />
            <Route path="/tipos/edit/:id" element={<EditTipo />} />
            <Route path="/administradores" element={<Administradores />} />
            <Route path="/add_admin" element={<AdminForm />} />
            <Route path="/administradores/:id" element={<AdminDetail />} />
            <Route path="/administradores/edit/:id" element={<EditAdmin />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/add_tickets" element={<TicketForm />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/tickets/edit/:id" element={<TicketEdit />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/add_servicios" element={<ServicioForm />} />
            <Route path="/servicios/:id" element={<ServicioDetail />} />
            <Route path="/servicios/edit/:id" element={<ServicioEdit />} />
            <Route path="/liners" element={<Liners />} />
            <Route path="/add_liner" element={<AddLiner />} />
            <Route path="/liners/:id" element={<LinerDetail />} />
            <Route path="/liners/edit/:id" element={<EditLiner />} />
            <Route path="/propuestas" element={<Propuestas />} />
            <Route path="/add_propuestas" element={<PropuestaForm />} />
            <Route path="/propuestas/:id" element={<PropuestaDetail />} />
            <Route path="/propuestas/edit/:id" element={<PropuestaEdit />} />
          </Route>

          <Route element={<ProtectedRouteClient />}>
            <Route path="/client/home" element={<ClientHome />} />
            <Route path="/client/tickets" element={<ClientTickets />} />
            <Route path="/client/services" element={<ClientServices />} />
            <Route path="/client/services/new" element={<ClientServiceForm />} />
            <Route path="/client/services/:id" element={<ClientServiceDetail />} />
          </Route>

          <Route element={<ProtectedRouteLiner />}>
            <Route path="/liner/home" element={<LinerHome />} />
          </Route>
        </Route>

      </Route>
    )
);