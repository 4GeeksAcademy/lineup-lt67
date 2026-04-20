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
import { Clientes } from "./pages/AdminPages/Clientes";
import { ClientForm } from "./pages/AdminPages/ClientForm";
import { ClientEdit } from "./pages/AdminPages/ClientEdit";
import { ClientLogin } from "./pages/ClientLogin";
import { Tipos } from "./pages/AdminPages/Tipos";
import { TipoForm } from "./pages/AdminPages/TipoForm";
import { TipoEdit } from "./pages/AdminPages/TipoEdit";
import {Administradores} from "./pages/AdminPages/Administradores";
import { TipoDetail } from "./pages/AdminPages/TipoDetail";
import { AdminForm } from "./pages/AdminPages/AdminForm";
import { AdminEdit } from "./pages/AdminPages/AdminEdit";
import { AdminDetail } from "./pages/AdminPages/AdminDetail"
import { AdminLayout } from "./pages/AdminLayout";

import { ClientDetail } from "./pages/AdminPages/ClientDetail";
import { Favoritos } from "./pages/Favoritos";
import { AdminLogin } from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

import { Establecimientos } from "./pages/AdminPages/Establecimientos";
import { EstablecimientoForm } from "./pages/AdminPages/EstablecimientoForm";
import { EstablecimientoEdit } from "./pages/AdminPages/EstablecimientoEdit";
import { EstablecimientoDetail } from "./pages/AdminPages/EstablecimientoDetail";
import { EstablecimientoLogin } from "./pages/EstablecimientosCRUD/EstablecimientoLogin"
import { EstablecimientoDashboard } from "./pages/EstablecimientosCRUD/EstablecimientoDashboard"
import { ProtectedRouteEstablecimiento } from "./components/ProtectedRouteEstablecimiento";

import { SucursalForm } from "./pages/EstablecimientosCRUD/SucursalForm";
import { SucursalEdit } from "./pages/EstablecimientosCRUD/SucursalEdit"
import { SucursalDashboard } from "./pages/EstablecimientosCRUD/SucursalDashboard"

import { SucursalFormADM } from "./pages/AdminPages/SucursalForm";
import { SucursalEditADM } from "./pages/AdminPages/SucursalEdit"

import { ProtectedRouteClient } from "./components/ProtectedRouteClient";

import { Tickets } from "./pages/TicketsCRUD/Tickets";
import { TicketForm } from "./pages/TicketsCRUD/TicketForm";
import { TicketDetail } from "./pages/TicketsCRUD/TicketDetail";
import { TicketEdit } from "./pages/TicketsCRUD/TicketEdit";

import { Servicios } from "./pages/ServiciosCRUD/Servicios";
import { ServicioForm } from "./pages/ServiciosCRUD/ServicioForm";
import { ServicioDetail } from "./pages/ServiciosCRUD/ServicioDetail";
import { ServicioEdit } from "./pages/ServiciosCRUD/ServicioEdit";

import { Liners } from "./pages/AdminPages/Liners"
import { LinerForm } from "./pages/AdminPages/LinerForm"
import { LinerEdit } from "./pages/AdminPages/LinerEdit"
import { LinerDetail } from "./pages/AdminPages/LinerDetail"
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
import { LinerChat } from "./pages/LinerChat";

import LandingPage from "./landingpage/LandingPage"

export const router = createBrowserRouter(
    createRoutesFromElements(
      // CreateRoutesFromElements function allows you to build route elements declaratively.
      // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
      // Root, on the contrary, create a sister Route, if you have doubts, try it!
      // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
      // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      <Route errorElement={<h1>Not found!</h1>}>
        {/* Landing Page Aislada */}

        <Route path="/landingpage" element={<LandingPage />} />

        <Route path="/establecimiento/login" element={<EstablecimientoLogin />} />
          <Route path="/establecimiento" element={<Navigate to="/establecimiento/login" replace />} />
          <Route element={<ProtectedRouteEstablecimiento />}>
            <Route path="/establecimiento/dashboard" element={<EstablecimientoDashboard />} />
            <Route path="/establecimiento/sucursal/:id" element={<SucursalDashboard />} />
            <Route path="/sucursal/nueva" element={<SucursalForm />} />
            <Route path="/establecimiento/sucursal/edit/:id" element={<SucursalEdit />} />
          </Route>
          
        
        <Route path= "/" element={<LandingPage />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/liner/login" element={<LinerLogin />} />
        <Route path="/liner/register" element={<LinerRegister />} />
        <Route path="/simplemap" element={<SimpleMap />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/clients" element={<Clientes />} />
              <Route path="/add_client" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/clients/edit/:id" element={<ClientEdit />} />
              <Route path="/tipos" element={<Tipos />} />
              <Route path="/add_tipo" element={<TipoForm />} />
              <Route path="/tipos/:id" element={<TipoDetail />} />
              <Route path="/tipos/edit/:id" element={<TipoEdit />} />
              <Route path="/administradores" element={<Administradores />} />
              <Route path="/add_admin" element={<AdminForm />} />
              <Route path="/administradores/:id" element={<AdminDetail />} />
              <Route path="/administradores/edit/:id" element={<AdminEdit />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/add_tickets" element={<TicketForm />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/tickets/edit/:id" element={<TicketEdit />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/add_servicios" element={<ServicioForm />} />
              <Route path="/servicios/:id" element={<ServicioDetail />} />
              <Route path="/servicios/edit/:id" element={<ServicioEdit />} />
              <Route path="/liners" element={<Liners />} />
              <Route path="/add_liner" element={<LinerForm />} />
              <Route path="/liners/:id" element={<LinerDetail />} />
              <Route path="/liners/edit/:id" element={<LinerEdit />} />
              <Route path="/propuestas" element={<Propuestas />} />
              <Route path="/add_propuestas" element={<PropuestaForm />} />
              <Route path="/propuestas/:id" element={<PropuestaDetail />} />
              <Route path="/propuestas/edit/:id" element={<PropuestaEdit />} />
              <Route path="/establecimientos" element={<Establecimientos />} />
              <Route path="/add_establecimientos" element={<EstablecimientoForm />} />
              <Route path="/establecimientos/:id/detalle" element={<EstablecimientoDetail />} />
              <Route path="/establecimiento/edit/:id" element={<EstablecimientoEdit />} />
              <Route path="/sucursal/adm/nueva" element={<SucursalFormADM />} />
              <Route path="/sucursal/adm/edit/:id" element={<SucursalEditADM />} />
            </Route>
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
            <Route path="/liner/services/:id/chat" element={<LinerChat />} />
          </Route>
        </Route>

    )
);