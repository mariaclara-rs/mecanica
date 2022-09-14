import React, { useEffect, useState, useContext } from 'react';

import {UtilsContext} from '../../context/UtilsContext'

import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import Search from '../../components/Search'
import ModalExcluir from '../../components/ModalExcluir';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FiTrash, FiEdit } from 'react-icons/fi';
import { BiCar } from "react-icons/bi";

function Veiculo() {

    const [placa, setPlaca] = useState('');
    const [cor, setCor] = useState('');
    const [modelo, setModelo] = useState('');
    const [ano, setAno] = useState('');
    const [cliId, setCliId] = useState();
    const [marcaId, setMarcaId] = useState();

    const [veiculos, setVeiculos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);
    const [id, setId] = useState('');
    const [filtro, setFiltro] = useState();
    const [campoBusca, setCampoBusca] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [placaTemp, setPlacaTemp] = useState('');

    const {sleep,alerta,msgForm,setMsgForm,classes,setClasses} = useContext(UtilsContext)

    const schema = yup.object({
        cliId: yup.string().required("Selecione um cliente"),
        placa: yup.string().required("Informe a placa").length(7, "Informe uma placa válida"),
        marcaId: yup.string().required("Selecione a marca do veículo"),

    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarVeiculos();
        carregarClientes();
        carregarMarcas();
    }, []);


    async function carregarVeiculos() {
        const resp = await api.get('/veiculos');
        setVeiculos(resp.data);
    }

    async function carregarClientes() {
        const resp = await api.get('/clientes');
        setClientes(resp.data);
    }

    async function carregarMarcas() {
        const resp = await api.get('/marcas');
        setMarcas(resp.data);
    }
   
    async function gravarVeiculo(e) {
        e.preventDefault();
        //console.log("cliente: " + cliId + " placa: " + placa + " marca: " + marcaId);
        if (placa.length > 0 && cliId != undefined && marcaId != undefined) {
            if (errors.placa == undefined) {
                let resp;
                if (add) {
                    resp = await api.post('/veiculos/gravar', {
                        placa, cor, modelo, ano, cliId, marcaId
                    })
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Veículo já existente!');
                    }
                    else {
                        limparForm();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Veículo cadastrado!');
                    }
                }
                else {
                    //console.log("id: " + id + " placa: " + placa + " cor: " + cor + " modelo: " + modelo + "ano: " + ano + " cliId: " + cliId + " marcaId: " + marcaId);
                    //console.log(Number(cliId))
                    resp = await api.put('/veiculos/editar', {
                        id, placa, cor, modelo, ano, cliId: Number(cliId), marcaId
                    })
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar veículo!');
                    }
                    else {
                        setAdd(true);
                        limparForm();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Dados atualizados!');
                    }
                }
                carregarVeiculos();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos obrigatórios!');
        }
    }

    async function excluirVeiculo() {
        const resp = await api.delete('/veiculos/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Impossível excluir veículo').then(() => { setModalExcluir(false); setPlacaTemp('') })
        }
        else {
            alerta('mensagemForm mensagemForm-Sucesso', 'Veículo excluído').then(() => { setModalExcluir(false); setPlacaTemp(''); })

        }
        carregarVeiculos();
    }

    async function editarVeiculo(ve_id, i) {
        setId(ve_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    function carregarCampos(i) {
        setPlaca(veiculos[i].ve_placa);
        setValue("placa", veiculos[i].ve_placa)
        setCor(veiculos[i].ve_cor);
        setValue("cor", veiculos[i].ve_cor);
        setModelo(veiculos[i].ve_modelo);
        setValue("modelo", veiculos[i].ve_modelo);
        setAno(veiculos[i].ve_ano);
        setValue("ano", veiculos[i].ve_ano);
        setMarcaId(veiculos[i].mc_id);
        setValue("marcaId", veiculos[i].mc_id);
        setCliId(veiculos[i].cli_id);
        setValue("cliId", veiculos[i].cli_id);
    }

    function limparForm(i) {
        setPlaca('');
        setValue("placa", "");
        setCor('');
        setValue("cor", "");
        setModelo('');
        setValue("modelo", "");
        setAno('');
        setValue("ano", "");
        setMarcaId();
        setValue("marcaId", "");
        setCliId();
        setValue("cliId", "");
        clearErrors();
        setAdd(true);
    }

    async function buscarVeiculo() {
        let resp;
        let params;
        if (campoBusca != '') {
            if (filtro == undefined || filtro == 1) {
                params = {
                    marca: campoBusca
                };
                resp = await api.get('/veiculos/marca', {
                    params
                })
            }
            else if (filtro == 2) {
                params = {
                    cliente: campoBusca
                };
                resp = await api.get('/veiculos/cliente', {
                    params
                })
            }
            else {
                params = {
                    placa: campoBusca
                };
                resp = await api.get('/veiculos/placa', {
                    params
                })
            }
            setVeiculos(resp.data.data);
        }
        else {
            carregarVeiculos();
        }
    }

    const formatCharsPlaca = {
        'L': '[A-Za-z]',
        'N': '[0-9]',
        'X': '[a-z0-9A-Z]'
    };

    return (
        <React.Fragment>

            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Veículos <BiCar size={25} style={{ margin: '0.3rem' }} /></h2>
                        <div className="line"></div>

                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            data-target="#exampleModalScrollable" onClick={() => { limparForm(); setModal(true) }}>
                            Adicionar +
                        </button>
                        {/*Campo de busca*/}
                        <div className="row mt-5 mb-3">
                            <div className="col-md-5">
                                <Search>
                                    <Search.Input placeholder="Busque por um veículo..." value={campoBusca} onChange={e => { setCampoBusca(e.target.value); buscarVeiculo(); }} onBlur={buscarVeiculo}/>
                                    <Search.Span onClick={() => { buscarVeiculo() }} />
                                </Search>
                            </div>
                            <div className="col-md-2">
                                <select id="filtro" className="form-select"
                                    value={filtro} onChange={e => { setFiltro(e.target.value) }}>
                                    <option selected disabled>Busque por</option>
                                    <option value={1}>Marca</option>
                                    <option value={2}>Cliente</option>
                                    <option value={3}>Placa</option>
                                </select>
                            </div>
                        </div>

                        <table className="table table-hover" style={{ overflow: 'auto' }} >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Modelo</th>
                                    <th scope="col">Placa</th>
                                    <th scope="col">Cor</th>
                                    <th scope="col">Proprierário</th>
                                    <th scope="col">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {veiculos.map((v, i) => (
                                    <tr key={i}>
                                        <th scope="row">{v.ve_id}</th>
                                        <td>{v.mc_nome}</td>
                                        <td>{v.ve_modelo}</td>
                                        <td>{v.ve_placa}</td>
                                        <td>{v.ve_cor}</td>
                                        <td>{v.cli_nome}</td>
                                        <td >
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { limparForm(); clearErrors(); editarVeiculo(v.ve_id, i) }}>
                                                <FiEdit style={{ color: '#231f20' }} />
                                            </Button>
                                            <Button className='m-0 p-0 px-1 border-0 bg-transparent' onClick={() => { setId(v.ve_id); setPlacaTemp(v.ve_placa); setModalExcluir(true); }} >
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

            <React.Fragment>
                <Modal className="lg" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='modal-title' closeButton >{add ? "Cadastro de Veículo" : "Editar veículo"}</Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className="col-md-12">
                                <label htmlFor="cliId">Cliente Proprietário *</label>
                                <select id="cliId" name="cliId" className="form-select" {...register("cliId")}
                                    value={cliId} onChange={e => { setCliId(e.target.value); setValue("cliId", e.target.value); errors.cliId && trigger('cliId'); }}>
                                    <option disabled selected value={""}>Selecione</option>
                                    {clientes.map((cli, i) => (
                                        <option key={i} value={cli.cli_id}>{cli.cli_nome}</option>
                                    ))}
                                </select>
                                {errors.cliId && <p className="erroForm">{errors.cliId?.message}</p>}
                            </div>

                            {add ?
                                <Form.Input cols="col-md-6" id="placa" placeholder="..." label="Placa *" register={register}
                                    value={placa} onChange={e => { setPlaca(e.target.value); setValue("placa", e.target.value); errors.placa && trigger("placa") }}
                                    erro={errors.placa} formatChars={formatCharsPlaca} mascara="LLLNXNN" />
                                :
                                <Form.Input readOnly cols="col-md-6" id="placa" placeholder="..." label="Placa *" register={register}
                                    value={placa} onChange={e => { setPlaca(e.target.value); setValue("placa", e.target.value); errors.placa && trigger("placa") }}
                                    erro={errors.placa} formatChars={formatCharsPlaca} mascara="LLLNXNN" />
                            }



                            <div className="col-md-6">
                                <label htmlFor="marcaId">Marca *</label>
                                <select id="marcaId" name="marcaId" className="form-select" {...register("marcaId")}
                                    value={marcaId} onChange={e => { setMarcaId(e.target.value); setValue("marcaId", e.target.value); errors.marcaId && trigger("marcaId") }}>
                                    <option disabled selected value={""}>Selecione</option>
                                    {marcas.map((m, i) => (
                                        <option key={i} value={m.mc_id}>{m.mc_nome}</option>
                                    ))}
                                </select>
                                {errors.marcaId && <p className="erroForm">{errors.marcaId?.message}</p>}
                            </div>

                            <Form.Input cols="col-md-12" id="modelo" placeholder="..." label="Modelo"
                                value={modelo} onChange={e => setModelo(e.target.value)} register={register} />

                            <Form.Input mascara="9999" cols="col-md-6" id="ano" placeholder="..." label="Ano"
                                value={ano} onChange={e => setAno(e.target.value)} register={register} />

                            <Form.Input cols="col-md-6" id="cor" placeholder="..." label="Cor"
                                value={cor} onChange={e => setCor(e.target.value)} register={register} />

                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModal(false); limparForm(); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarVeiculo(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="veículo" valor={placaTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirVeiculo() }} />
        </React.Fragment>

    );
}

export default Veiculo;
