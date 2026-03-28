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
import { Establecimientos } from "./pages/Establecimientos";
import { EstablecimientoForm } from "./pages/EstablecimientoForm";
import { EditEstablecimiento } from "./pages/EditEstablecimiento";
import { EstablecimientoDetail } from "./pages/EstablecimientoDetail";
import { SucursalForm } from "./pages/SucursalForm";
import { SucursalEdit } from "./pages/SucursalEdit"
import { Favoritos } from "./pages/Favoritos";
import { AdminLogin } from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Tickets } from "./pages/TicketsCRUD/Tickets";
import { TicketForm } from "./pages/TicketsCRUD/TicketForm";
import { TicketDetail } from "./pages/TicketsCRUD/TicketDetail";
import { TicketEdit } from "./pages/TicketsCRUD/TicketEdit";

import { Servicios } from "./pages/ServiciosCRUD/Servicios";
import { ServicioForm } from "./pages/ServiciosCRUD/ServicioForm";
import { ServicioDetail } from "./pages/ServiciosCRUD/ServicioDetail";
import { ServicioEdit } from "./pages/ServiciosCRUD/ServicioEdit";


export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/clients/login" element={<ClientLogin />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/clients" element={<Clientes />} />
          <Route path="/add_client" element={<ClientForm />} />
          <Route path="/clients/:id" element={ <ClientDetail />} />
          <Route path="/clients/edit/:id" element={ <EditClient />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/add_tipo" element={<TipoForm />} />
          <Route path="/tipos/:id" element={ <TipoDetail />} />
          <Route path="/tipos/edit/:id" element={ <EditTipo />} />
          <Route path="/administradores" element={<Administradores />} />
          <Route path="/add_admin" element={<AdminForm />} />
          <Route path="/administradores/:id" element={<AdminDetail />} />
          <Route path="/administradores/edit/:id" element={<EditAdmin />} />
          <Route path="/establecimientos" element={<Establecimientos />} />
          <Route path="/add_establecimiento" element={<EstablecimientoForm />} />
          <Route path="/establecimientos/:id/detalle" element={<EstablecimientoDetail />} />
          <Route path="/establecimientos/:id" element={<EditEstablecimiento />} />
          <Route path="/sucursal/nueva" element={<SucursalForm />} />
          <Route path="/sucursal/:id" element={<SucursalEdit />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/add_tickets" element={<TicketForm />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/tickets/edit/:id" element={<TicketEdit />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/add_servicios" element={<ServicioForm />} />
          <Route path="/servicios/:id" element={<ServicioDetail />} />
          <Route path="/servicios/edit/:id" element={<ServicioEdit />} />
        </Route>
      </Route>
    )
);