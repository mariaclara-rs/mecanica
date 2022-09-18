import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Cliente from './pages/basicas/Cliente';
import Veiculo from './pages/basicas/Veiculo';
import Servico from './pages/basicas/Servico';
import Distribuidora from './pages/basicas/Distribuidora';
import Peca from './pages/basicas/Peca';
import Marca from './pages/basicas/Marca';
import Login from './pages/basicas/Login';
import OrdemServico from './pages/fundamentais/OS';
import ContaReceber from './pages/fundamentais/ContaReceber';
import './style.css'
import { UtilsProvider } from './context/UtilsContext';
import DadosProvider from './context/DadosContext';
import Agendamentos from './pages/fundamentais/Agendamentos';
import ContaPagar from './pages/fundamentais/ContaPagar';

function PrivateRoute() {

    let auth = localStorage.getItem("token")
    return auth ? <Outlet /> : <Navigate to="/" />;
}

function Rotas() {

    return (
        <UtilsProvider>
            <DadosProvider>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Login />} />

                        <Route exact path="/" element={<PrivateRoute />}>
                            <Route exact path="/clientes" element={<Cliente />} />
                            <Route path="/servicos" element={<Servico />} />
                            <Route exact path="/veiculos" element={<Veiculo />} />
                            <Route exact path="/distribuidoras" element={<Distribuidora />} />
                            <Route exact path='/pecas' element={<Peca />} />
                            <Route exact path='/marcas' element={<Marca />} />
                            <Route exact path='ordemservico' element={<OrdemServico />} />
                            <Route exact path='contareceber' element={<ContaReceber />} />
                            <Route exact path='/agendamentos' element={<Agendamentos />} />
                            <Route exact path='/contapagar' element={<ContaPagar/>} />
                        </Route>

                    </Routes>
                </BrowserRouter>
            </DadosProvider>
        </UtilsProvider>
    );
};
export default Rotas;
