import React, { useEffect, useState, useContext } from 'react';
import './Sidebar.css'
import '../style.css'
import { IoIosArrowDown } from "react-icons/io";
import { BiGroup, BiCar, BiBuildings, BiBriefcaseAlt2, BiGlobe, BiMoney } from "react-icons/bi"
import { BsClockHistory } from 'react-icons/bs'
import { RiListSettingsLine, RiWallet3Line } from 'react-icons/ri'
import { FiTool } from 'react-icons/fi'
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { Modal } from 'react-bootstrap';
import Form from './Form';
import api from '../services/api';

import { DadosContext } from '../context/DadosContext';
import EmitirRelCaixa from '../reports/EmitirRelCaixa';
//FaTools

function Sidebar() {
    const [pageatual, setPageAtual] = useState("");
    const [classe, setClasse] = useState("collapse")
    const [cssheight, setCssHeight] = useState("0px;")
    const [open, setOpen] = useState(false);

    const [modal, setModal] = useState(false);
    const [dataIni, setDataIni] = useState("");
    const [dataFim, setDataFim] = useState("");

    const [msgForm, setMsgForm] = useState("");
    const [classes, setClasses] = useState("");

    const {carregarDadosMecanica } = useContext(DadosContext)

    const options = [{ link: "/ordemservico", name: "Ordem de Serviço", icon: <RiListSettingsLine size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/agendamentos", name: "Agendamentos", icon: <BsClockHistory size={18} style={{ margin: '0.3rem' }} /> },
    { link: "/contareceber", name: "Contas a Receber", icon: <BiMoney size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/contapagar", name: "Contas a Pagar", icon: <RiWallet3Line size={20} style={{ margin: '0.3rem' }} /> }];

    const basicas = [{ link: "/clientes", name: "Clientes", icon: <BiGroup size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/veiculos", name: "Veículos", icon: <BiCar size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/servicos", name: "Serviços", icon: <BiBriefcaseAlt2 size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/pecas", name: "Peças", icon: <FiTool style={{ margin: '0.3rem' }} /> },
    { link: "/distribuidoras", name: "Distribuidoras", icon: <BiBuildings size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/marcas", name: "Marcas", icon: <BiGlobe size={20} style={{ margin: '0.3rem' }} /> }]

    useEffect(() => {
        var tam = window.location.href.split('/').length
        var paginaatual = "/" + window.location.href.split('/')[tam - 1]
        setPageAtual(paginaatual);

        var tambasicas = basicas.length; let i;
        for (i = 0; i < tambasicas && basicas[i].link != paginaatual; i++);
        if (i < tambasicas) {
            setClasse("in")
            setCssHeight("auto;")
            setOpen(true);
        }
    }, []);

    function menuCadBasicos() {
        if (classe == "in") {
            setClasse("collapse");
            setCssHeight("0px;");
        }
        else {
            setClasse("in");
            setCssHeight("auto;");
        }
    }

    async function emitirRel() {

        if (dataIni != "" && dataFim != "") {
            if (dataIni > dataFim) {
                setClasses("mensagemForm mensagemForm-Erro");
                setMsgForm("Data final deve ser anterior a data inicial");
            }
            else {
                setMsgForm(""); setClasses("");
                const params = {
                    dtIni: dataIni,
                    dtFim: dataFim
                };
                
                const resp = await api.get('/relcaixa', { params })
                carregarDadosMecanica().then((respMec)=>{EmitirRelCaixa(dataIni, dataFim, resp.data,respMec);});
            }
        }
        else {
            setClasses("mensagemForm mensagemForm-Alerta");
            setMsgForm("Preencha ambas as datas");
        }
    }
    return (
        <React.Fragment>

            <nav id="sidebar">
                <ul className="list-unstyled components">

                    <div className="container row mb-4">
                        <div className="col-md-10">
                            <p style={{ display: 'inline' }}><b>Painel de Controle</b></p>
                        </div>
                        <div className="col-md-2 alinharIconPainel">
                            <img src={require('../img/mecanico.png')} style={{ width: '2.7em', marginLeft: '-2em' }} />
                        </div>
                    </div>

                    <li>
                        <a onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>
                            Cadastros base<IoIosArrowDown size={20} style={{ margin: '0.3rem' }} />
                        </a>
                    </li>
                    <Collapse in={open}>
                        <div id="example-collapse-text">
                            {basicas.map((option, i) => {
                                return (
                                    <li key={i}>{/*f2f2f1*/}
                                        {pageatual == option.link ?
                                            <a href={option.link} style={{ backgroundColor: '#6c757d', color: '#fff', fontSize: '1em' }}> {/*style={{backgroundColor:active && 'red'}}*/}
                                                &nbsp;&nbsp;
                                                {option.icon}
                                                {option.name}
                                            </a>
                                            :
                                            <a href={option.link} style={{ fontSize: '1em', color: '#35363a' }}> {/*style={{backgroundColor:active && 'red'}}*/}
                                                <b>&nbsp;&nbsp;
                                                    {option.icon}
                                                    {option.name}</b>
                                            </a>
                                        }
                                    </li>
                                )
                            })}

                        </div>
                    </Collapse>
                    {options.map((option, i) => {
                        return (
                            <li key={i}>{/*f2f2f1*/}
                                {pageatual == option.link ?
                                    <a href={option.link} style={{ backgroundColor: '#6c757d', color: '#fff' }}> {/*style={{backgroundColor:active && 'red'}}*/}
                                        {option.icon}
                                        {option.name}
                                    </a>
                                    :
                                    <a href={option.link}> {/*style={{backgroundColor:active && 'red'}}*/}
                                        {option.icon}
                                        {option.name}
                                    </a>
                                }
                            </li>
                        )
                    })}
                    {options.length > 0 &&
                        <li key={options.length}>
                            <a onClick={() => setModal(true)}>Relário de Caixa</a>
                        </li>
                    }
                    <li key={options.length+1}>{/*f2f2f1*/}
                        {pageatual == '/meusdados' ?
                            <a href='/meusdados' style={{ backgroundColor: '#6c757d', color: '#fff' }}> {/*style={{backgroundColor:active && 'red'}}*/}
                                Perfil
                            </a>
                            :
                            <a href='/meusdados'> {/*style={{backgroundColor:active && 'red'}}*/}
                                Perfil
                            </a>
                        }
                    </li>
                </ul>
            </nav>
            <>
                <Modal show={modal} onHide={() => { setModal(false); setMsgForm(""); setClasses(""); setDataIni(""); setDataFim(""); }}
                    className="oi">
                    <Modal.Body>
                        <Form>
                            <Form.Input type="date" cols="col-md-6" value={dataIni}
                                id="dataIni" name="dataIni" label="Data inicial"
                                onChange={e => { setDataIni(e.target.value) }} />
                            <Form.Input type="date" cols="col-md-6" value={dataFim}
                                id="dataFim" name="dataFim" label="Data final"
                                onChange={e => { setDataFim(e.target.value) }} />
                        </Form>
                        {msgForm != '' && <p className={classes}> {msgForm} </p>}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" className='btn-sm' onClick={() => setModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" className='btn-sm' onClick={() => { emitirRel() }}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </React.Fragment >
    )
}
export default Sidebar;