import React, { useEffect, useState, useContext } from 'react';
import './Sidebar.css'
import '../style.css'
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BiGroup, BiCar, BiBuildings, BiBriefcaseAlt2, BiGlobe, BiMoney } from "react-icons/bi"
import { BsClockHistory, BsReddit } from 'react-icons/bs'
import { RiListSettingsLine, RiWallet3Line } from 'react-icons/ri'
import { FiTool } from 'react-icons/fi'
import UtilsContext from '../context/UtilsContext';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

//FaTools

function Sidebar() {
    const [pageatual, setPageAtual] = useState("");
    const [classe, setClasse] = useState("collapse")
    const [cssheight, setCssHeight] = useState("0px;")
    const [open, setOpen] = useState(false);
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
                        <div id="example-collapse-text" >
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

                </ul>
            </nav>
        </React.Fragment >
    )
}
export default Sidebar;