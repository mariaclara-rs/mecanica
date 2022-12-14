import React, { useEffect, useState, useContext } from 'react';

import { UtilsContext } from '../../context/UtilsContext'

import api from '../../services/api';

import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Form'
import Search from '../../components/Search'
import ModalExcluir from '../../components/ModalExcluir';
import AreaSearch from '../../components/AreaSearch';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FiTrash, FiEdit, FiEye } from 'react-icons/fi';
import { BiBuildings } from "react-icons/bi"

import BtSair from '../../components/BtSair';

import ToastMessage from '../../components/ToastMessage';

function Distribuidora() {
    const [nome, setNome] = useState('');
    const [tel, setTel] = useState('');
    const [cnpj, setCNPJ] = useState('');

    const [dist, setDist] = useState([]);

    const [modal, setModal] = useState(false);
    const [add, setAdd] = useState(true);
    const [id, setId] = useState('');;
    const [distTemp, setDistTemp] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [campoBusca, setCampoBusca] = useState('');

    const [toast, setToast] = useState(false);
    const [classeToast, setClasseToast] = useState();
    const [msgToast, setMsgToast] = useState("");
    const [tituloToast, setTituloToast] = useState("");

    const [visualizar, setVisualizar] = useState(false);

    const { sleep, alerta, msgForm, setMsgForm, classes, setClasses, logout } = useContext(UtilsContext)

    const schema = yup.object({
        nome: yup.string().required("Informe o nome da distribuidora"),
        tel: yup.string().length(13, "Informe um número válido"),
        cnpj: yup.string().length(18, "CNPJ deve ter 14 dígitos"),

    }).required();

    const { register, handleSubmit, trigger, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onChange', resolver: yupResolver(schema) });

    useEffect(() => {
        carregarDist();
    }, []);

    async function carregarDist() {
        const resp = await api.get('/distribuidoras');
        if (campoBusca.length > 0)
            setDist(resp.data.filter(d => d.dist_nome.toUpperCase().includes(campoBusca.toUpperCase())))
        else
            setDist(resp.data);
    }

    async function editarDist(dist_id, i) {
        setId(dist_id);
        carregarCampos(i);
        setAdd(false);
        setModal(true);
    }

    async function visualizarDist(dist_id, i) {
        carregarCampos(i);
        setVisualizar(true);
        setModal(true);
    }

    async function excluirDist() {
        const resp = await api.delete('/distribuidoras/' + id);
        if (JSON.stringify(resp.data.status) == 'false') {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Erro. Não foi possível excluir a distribuidora");
            setClasseToast('Danger');
            setToast(true);
            setModalExcluir(false);
            setDistTemp('');
        }
        else {
            setToast(false);
            setTituloToast("Exclusão")
            setMsgToast("Distribuidora excluída");
            setClasseToast('Success');
            setToast(true);
            setModalExcluir(false);
            setDistTemp('');
        }
        carregarDist();
    }

    async function gravarDist(e) {

        e.preventDefault();
        if (nome.length > 0 && tel.length > 0) {
            if (errors.nome == undefined && errors.tel == undefined) {
                let resp;

                if (add) {
                    if (cnpj.length == 0)
                        resp = await api.post('/distribuidoras/gravar', {
                            nome, tel, cnpj: null
                        });
                    else
                        resp = await api.post('/distribuidoras/gravar', {
                            nome, tel, cnpj
                        });


                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar cadastrar distribuidora!');
                    }
                    else {
                        limparCampos();
                        clearErrors();
                        setToast(false);
                        setTituloToast("Cadastro")
                        setMsgToast("Distribuidora cadastrada com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        setModal(false);
                    }
                }
                else {
                    resp = await api.put('/distribuidoras/editar/', {
                        id, nome, tel, cnpj
                    });
                    setAdd(true);
                    if (JSON.stringify(resp.data.status) == 'false') {
                        alerta('mensagemForm mensagemForm-Erro', 'Erro ao tentar editar distribuidora!');
                    }
                    else {
                        limparCampos();
                        setToast(false);
                        setTituloToast("Edição")
                        setMsgToast("Dados atualizados com sucesso!");
                        setClasseToast('Success');
                        setToast(true);
                        setModal(false);
                    }
                }
                carregarDist();
            }
            else {
                alerta('mensagemForm mensagemForm-Alerta', 'Corriga os erros dos campos obrigatórios!');
            }
        }
        else {
            alerta('mensagemForm mensagemForm-Alerta', 'Preencha os campos obrigatórios!');
        }
    }

    function limparCampos() {
        setNome('');
        setValue("nome", "");
        setTel('');
        setValue("tel", "");
        setCNPJ('');
        setValue("cnpj", "");
        setAdd(true);
    }
    function carregarCampos(i) {
        setNome(dist[i].dist_nome);
        if (dist[i].dist_cnpj != null) {
            setCNPJ(dist[i].dist_cnpj);
            setValue("cnpj", dist[i].dist_cnpj);
        }
        setTel(dist[i].dist_tel);
        setValue("nome", dist[i].dist_nome);
        setValue("tel", dist[i].dist_tel);

    }

    return (
        <React.Fragment>

            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Distribuidoras <BiBuildings size={25} style={{ margin: '0.3rem' }} /></h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>
                        {/*botão modal*/}
                        <button type="button" className="btn btn-dark" data-toggle="modal"
                            onClick={() => { limparCampos(); clearErrors(); setModal(true) }}>
                            Adicionar +
                        </button>
                        {/*Campo de busca*/}
                        <AreaSearch placeholder="Busque por uma distribuidora..."
                            value={campoBusca} onKeyUp={carregarDist} onChange={(e) => setCampoBusca(e.target.value)} onClick={carregarDist} />
                        <div className="scrollYTable">
                            <table className="table table-hover" style={{ overflow: 'auto' }} >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">CNPJ</th>
                                        <th scope="col">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dist.map((d, i) => (
                                        <tr key={i}>
                                            <th scope="row">{d.dist_id}</th>
                                            <td>{d.dist_nome}</td>
                                            <td>{d.dist_tel}</td>
                                            <td>{d.dist_cnpj}</td>
                                            <td>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Visualizar"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { visualizarDist(d.dist_id, i); }}>
                                                    <FiEye className='btComum' />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Editar"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-dark' onClick={() => { limparCampos(); clearErrors(); editarDist(d.dist_id, i) }}>
                                                    <FiEdit className='btComum' />
                                                </Button>
                                                <Button data-toggle="tooltip" data-placement="bottom" title="Excluir"
                                                    className='m-0 p-0 px-1 border-0 bg-transparent btn-danger'>
                                                    <FiTrash className='btExcluir' onClick={() => { setId(d.dist_id); setDistTemp(d.dist_nome); setModalExcluir(true); }} />
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
                <Modal className="col-6" show={modal} onHide={() => { setModal(false); setVisualizar(false); clearErrors(); }}>
                    <Modal.Header className='modal-title' closeButton >{
                        visualizar ? "Visualizar distribuidora" : add ? "Cadastro de distribuidora" : "Editar distribuidora"}</Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Input leitura={visualizar} type="text" cols="col-md-12" id="nome" name="nome" placeholder="Ex: Gazzoni Peças" label="Nome da Distribuidora *" register={register}
                                value={nome} onChange={e => { setNome(e.target.value); setValue("nome", e.target.value); errors.nome && trigger('nome'); }} erro={errors.nome} />

                            <Form.Input leitura={visualizar} mascara="99.999.999/0001-99" type="text" cols="col-md-6" id="cnpj" name="cnpj" placeholder="11.111.111/0001-11" label="CNPJ"
                                register={register} value={cnpj} onChange={e => { setCNPJ(e.target.value); setValue("cnpj", e.target.value); errors.cnpj && trigger('cnpj') }} erro={errors.cnpj} />
                            <Form.Input leitura={visualizar} mascara="(99)9999-9999" type="text" cols="col-md-6" id="tel" name="tel" placeholder="..." label="Telefone *" register={register}
                                value={tel} onChange={e => { setTel(e.target.value); setValue("tel", e.target.value); errors.tel && trigger('tel'); }} erro={errors.tel} />
                        </Form>

                        {msgForm != '' && <p className={classes}> {msgForm} </p>}

                    </Modal.Body>
                    <Modal.Footer>
                        {visualizar ?
                            <>
                                <Button variant="secondary" disabled>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" disabled>
                                    Confirmar
                                </Button>
                            </>
                            :
                            <>
                                <Button variant="secondary" onClick={() => { setModal(false); limparCampos() }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" onClick={(e) => { handleSubmit(gravarDist(e)) }} >
                                    Confirmar
                                </Button>
                            </>
                        }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>


            <ModalExcluir show={modalExcluir} onHide={() => { setModalExcluir(false) }}
                item="distribuidora" valor={distTemp} classesMsg={classes} msg={msgForm}
                onClickCancel={() => { setModalExcluir(false) }} onClickSim={() => { excluirDist() }} />

            <ToastMessage show={toast} titulo={tituloToast} onClose={() => setToast(false)}
                classes={classeToast} msg={msgToast} />
        </React.Fragment>
    )
}
export default Distribuidora;