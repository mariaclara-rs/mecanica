import React, { useEffect, useState } from 'react';
import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import AreaSearch from '../../components/AreaSearch';
import BtAdicionar from '../../components/BtAdicionar';


import { FiTrash, FiEdit } from 'react-icons/fi';
import {BiMoney} from 'react-icons/bi'


function ContaReceber() {
    const [cr, serCR] = useState([])

    useEffect(() => {
        carregarCR();
    }, []);

    async function carregarCR() {
        const resp = await api.get('/contareceber');
        console.log(JSON.stringify(resp.data))
        serCR(resp.data)
    }
    function formatarData(data) {
        data = data.split('-')
        return data[2] + '/' + data[1] + '/' + data[0]
    }
    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Contas a Receber  <BiMoney style={{ color: '#231f20' }} /></h2>
                        <div className="line"></div>
                        <BtAdicionar />
                        <AreaSearch placeholder="Digite aqui..."/>

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Ordem de Serviço</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Veículo</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Data de Vencimento</th>
                                    <th scope="col">Observações</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cr.map((c, i) => (
                                    <tr key={i}>
                                        <th scope="row">{c.cr_id}</th>
                                        <td>{c.os_id}</td>
                                        <td>{c.cli_nome}</td>
                                        <td>{c.ve_placa}</td>
                                        <td>{c.cr_valor}</td>
                                        <td>{formatarData(c.cr_dtVenc.split('T')[0])}</td>
                                        <td>{c.os_observacoes.substring(0,30)}{(c.os_observacoes).length > 30 && "..."}</td>
                                        <td>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                <FiEdit style={{ color: '#231f20' }} />
                                            </Button>
                                            <Button
                                                className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                <FiTrash style={{ color: '#231f20' }} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ContaReceber;