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
import {GrTroubleshoot} from "react-icons/gr" 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Peca() {

    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState('')

    const [pecas, setPecas] = useState([])

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);

    const [id, setId] = useState('');
    const [pecaTemp, setPecaTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [campoBusca, setCampoBusca] = useState('');

    const {sleep,alerta,msgForm,setMsgForm,classes,setClasses} = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe o nome da peça"),
        preco: yup.string().required("Informe o preço")
    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarPecas();

    }, []);

    async function carregarPecas() {
        const resp = await api.get('/pecas');
        setPecas(resp.data);
    }

    async function gravarPeca(e) {
        e.preventDefault();
        if (nome.length > 0 && preco.length > 0) {
            if (errors.nome == undefined && errors.preco == undefined) {
                let resp;
                if (add) {
                    resp = await api.post('/pecas/gravar', {
                        nome, preco
                    });
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar peça!');
                    }
                    else {
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Peça cadastrado!');
                    }
                }
                else {
                    resp = await api.put('/pecas/editar', {
                        id, nome, preco
                    })
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar peça!');
                    }
                    else {
                        limparCampos();
                        alerta('mensagemForm mensagemForm-Sucesso', 'Dados atualizados!');
                    }
                }
                carregarPecas();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos!');
        }
    }

    async function excluirPeca() {
        const resp = await api.delete('/pecas/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            alerta('mensagemForm mensagemForm-Erro', 'Impossível excluir peça').then(() => { setModalExcluir(false); setPecaTemp('') })
        }
        else {
            alerta('mensagemForm mensagemForm-Sucesso', 'Peça excluída').then(() => { setModalExcluir(false); setPecaTemp(''); })

        }
        carregarPecas();
    }

    async function editarPeca(pec_id, i) {
        setId(pec_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    function limparCampos() {
        setNome('');
        setPreco('');
        setValue("nome", "");
        setValue("preco", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(pecas[i].pec_nome);
        setPreco((pecas[i].pec_preco).toFixed(2));
        setValue("nome", pecas[i].pec_nome);
        setValue("preco", pecas[i].pec_preco);
    }
    async function buscarPeca() {
        let resp;
        let params;
        if (campoBusca != '') {
          params = {
            nome: campoBusca
          };
          resp = await api.get('/pecas/nome', {
            params
          })
          setPecas(resp.data.data);
        }
        else {
          carregarPecas();
        }
      }

    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Peças <GrTroubleshoot size={22} style={{margin: '0.3rem'}}/></h2>
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
                                    <Search.Input placeholder="Busque por peças..." value={campoBusca} onChange={e => { setCampoBusca(e.target.value); buscarPeca(); }} />
                                    <Search.Span onClick={()=>buscarPeca()}/>
                                </Search>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Preço</th>
                                        <th scope="col">Ação</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {pecas.map((p, i) => (
                                        <tr key={i}>
                                            <th scope="row">{p.pec_id}</th>
                                            <td>{p.pec_nome}</td>
                                            <td>{(p.pec_preco).toFixed(2)}</td>
                                            <td >
                                                <Button className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiEdit style={{ color: '#231f20' }} onClick={() => { clearErrors(); limparCampos(); editarPeca(p.pec_id, i) }} />
                                                </Button>
                                                <Button
                                                    className='m-0 p-0 px-1 border-0 bg-transparent'>
                                                    <FiTrash style={{ color: '#231f20' }} onClick={() => { setId(p.pec_id); setPecaTemp(p.pec_nome); setModalExcluir(true); }} />
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
                    <Modal.Header className='modal-title' closeButton >{add ? "Cadastro de Peça" : "Editar Peça"}</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={gravarPeca}>
                            <Form.Input cols="col-md-12" id="nome" name="nome" placeholder="Ex: Chave de roda" label="Nome da Peça"
                                register={register} value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }}
                                erro={errors.nome} />

                            <Form.Input type="number" cols="col-md-5" id="preco" name="preco" placeholder="R$ 50.00" label="Preço"
                                register={register} value={preco} onChange={e => {
                                    setPreco(e.target.value); setValue("preco", e.target.value);
                                    errors.preco && trigger('preco');
                                }} erro={errors.preco} />

                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setModal(false); limparCampos(); }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarPeca(e)) }} >
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="peça" valor={pecaTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirPeca() }} />
        </React.Fragment>
    )
}
export default Peca;