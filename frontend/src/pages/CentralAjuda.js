import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import BtSair from '../components/BtSair';
import UtilsContext from '../context/UtilsContext';
import { FiHelpCircle } from 'react-icons/fi'
function CentralAjuda() {
    const { logout } = useContext(UtilsContext)
    return (
        <React.Fragment>
            <div className="wrapper">
                <Sidebar />
                <div id="content">
                    <div className="container-fluid col-md-12 m-2">
                        <h2 className="h2-titulo-secao">Ajuda <FiHelpCircle size={22} style={{ margin: '0.3rem' }} /></h2>
                        <BtSair onClick={logout} />
                        <div className="line"></div>
                        <div className='col-md-8' style={{margin: 'auto'}}>
                            <div className="ratio ratio-4x3">
                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/xU2D_53dKQw" allowfullscreen></iframe>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )

}
export default CentralAjuda;