import React, { useEffect, useState } from 'react';
import './Sidebar.css'
import '../style.css'
import { GrTroubleshoot } from "react-icons/gr";
import { BiGroup, BiCar, BiBuildings, BiBriefcaseAlt2,BiGlobe, BiMoney} from "react-icons/bi"
import { BsClockHistory } from 'react-icons/bs'
import {RiListSettingsLine} from 'react-icons/ri'
//FaTools

function Sidebar() {

    let active=true
    const options = [{ link: "/ordemservico", name: "Ordem de Serviço", icon:<RiListSettingsLine size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/contareceber", name: "Contas a Receber", icon: <BiMoney size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/agendamentos", name: "Agendamentos", icon: <BsClockHistory size={18} style={{ margin: '0.3rem' }} /> },
    { link: "/clientes", name: "Clientes", icon: <BiGroup size={20} style={{ margin: '0.3rem' }} /> }, 
    { link: "/veiculos", name: "Veículos", icon: <BiCar size={20} style={{ margin: '0.3rem' }} /> }, 
    { link: "/servicos", name: "Serviços", icon: <BiBriefcaseAlt2 size={20} style={{ margin: '0.3rem' }} /> }, 
    { link: "/pecas", name: "Peças", icon: <GrTroubleshoot style={{ margin: '0.3rem' }} /> },
    { link: "/distribuidoras", name: "Distribuidoras", icon: <BiBuildings size={20} style={{ margin: '0.3rem' }} /> },
    { link: "/marcas", name: "Marcas", icon:<BiGlobe size={20} style={{ margin: '0.3rem' }} /> }];
    return (
        <React.Fragment>

            <nav id="sidebar">
                <ul className="list-unstyled components">

                    <div className="row m-2 mb-0 pb-0">
                        <p className="col-md-10">Painel de Controle </p>
                        <div className="col-md-2">
                           
                            </div>
                    </div>
                    {options.map((option, i) => {
                        return (
                            <li key={i} >{/*f2f2f1*/}
                                <a  href={option.link}> {/*style={{backgroundColor:active && 'red'}}*/}
                                    {option.icon}
                                    {option.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </React.Fragment >
    )
}
export default Sidebar;