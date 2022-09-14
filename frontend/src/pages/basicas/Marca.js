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

import {BiGlobe} from "react-icons/bi" 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiTrash, FiEdit } from 'react-icons/fi';

function Marca() {

    const [nome, setNome] = useState('')
    const [marcas, setMarcas] = useState([])

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);

    const [id, setId] = useState('');
    const [marcaTemp, setMarcaTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [campoBusca, setCampoBusca] = useState('');

    const {sleep,alerta,msgForm,setMsgForm,classes,setClasses} = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe a marca"),
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarMarcas();

    }, []);

    async function carregarMarcas() {
        const resp = await api.get('/marcas');
        setMarcas(resp.data);
    }

    async function gravarMarca(e) {
        e.preventDefault();
        if (nome.length > 0) {
            if (errors.nome == undefined) {
                let resp;
                if (add) {
                    resp = await api.post('/marcas/gravar', {
                        nome
                    });
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar marca!');
                    }
                    else {
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Marca cadastrado!');
                    }
                }
                else {
                    resp = await api.put('/marcas/editar', {
                        id, nome
                    })
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar marca!');
                    }
                    else {
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Dados atualizados!');
                    }
                }
                carregarMarcas();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha a marca!');
        }
    }

    async function excluirMarca() {
        const resp = await api.delete('/marcas/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Impossível excluir marca').then(() => { setModalExcluir(false); setMarcaTemp('') })
        }
        else {
            alerta('mensagemForm mensagemForm-Sucesso', 'Marca excluída').then(() => { setModalExcluir(false); setMarcaTemp(''); })

        }
        carregarMarcas();
    }

    async function editarMarca(mc_id, i) {
        setId(mc_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    function limparCampos() {
        setNome('');
        setValue("nome", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(marcas[i].mc_nome);
        setValue("nome", marcas[i].mc_nome);
    }

    async function buscarMarca() {
        let resp;
        let params;
        if (campoBusca != '') {
          params = {
            nome: campoBusca
          };
          resp = await api.get('/marcas/nome', {
            params
          })
          setMarcas(resp.data.data);
        }
        else {
          carregarMarcas();
        }
      }
    

    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Marcas <BiGlobe size={22} style={{margin: '0.3rem'}}/></h2>
                        <div className="line"></div>

                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            data-target="#exampleModalScrollable" onClick={() => { clearErrors(); limparCampos(); setModal(true) }}>
                            Adicionar + <FontAwesomeIcon icon="fa-light fa-building-circle-arrow-right" />
                        </button>
                        {/*Campo de busca*/}
                        <div className="row mt-5 mb-3">
                            <div className="col-md-5">
                                <Search>
                                    <Search.Input placeholder="Busque por peças..." value={campoBusca} onChange={e => { setCampoBusca(e.target.value); buscarMarca(); }} />
                                    <Search.Span onClick={()=>buscarMarca()}/>
                                </Search>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marcas.map((m, i) => (
                                        <tr key={i}>
                                            <th scope="row">{m.mc_id}</th>
                                            <td>{m.mc_nome}</td>
                                            <td >
                                                <Button className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiEdit style={{ color: '#231f20' }} onClick={() => { clearErrors(); limparCampos(); editarMarca(m.mc_id, i) }} />
                                                </Button>
                                                <Button
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: '#231f20' }} onClick={() => { setId(m.mc_id); setMarcaTemp(m.mc_nome); setModalExcluir(true); }} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <React.Fragment>
                <Modal className="col-6" show={modal} onHide={() => { setModal(false) }}>
                    <Modal.Header className='modal-title' closeButton >{add ? "Cadastro de Marca" : "Editar Marca"}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={gravarMarca}>
                            <Form.Input cols="col-md-12" id="nome" name="nome" placeholder="Ex: Mercedes-Benz" label="Marca"
                                register={register} value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }}
                                erro={errors.nome} />

                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModal(false); limparCampos(); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarMarca(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="marca" valor={marcaTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirMarca() }} />
        </React.Fragment>
    )
}
export default Marca;