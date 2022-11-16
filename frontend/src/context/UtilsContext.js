import React, { createContext, useState } from 'react'
import ToastMessage from '../components/ToastMessage';


export const UtilsContext = createContext();

export function UtilsProvider({ children }) {

    const [msgForm, setMsgForm] = useState('');
    const [classes, setClasses] = useState('');
    const [atual, setAtual] = useState();


    const EnumTipoDespesa = {
        fixa: 1,
        variavel: 2
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function alerta(cls, msg) {
        setClasses(cls)
        setMsgForm(msg);
        await sleep(5000);
        setMsgForm('');
    }

    function formatarDataParaUsuario(data) {
        data = data.split('-')
        return data[2] + '/' + data[1] + '/' + data[0]
    }


    function formatarHorarioParaUsuario(horario) {
        return horario.substring(0, 5)
    }

    function setLinkAtual(nome) {
        setAtual(nome)
    }

    function logout(){
        
        localStorage.setItem('token','');
        window.location.reload();

    }

    function aredondar(val){
        return Math.round(val * 100) / 100
    }

    return (
        <UtilsContext.Provider
            value={{
                sleep, alerta, msgForm, setMsgForm, classes, setClasses, formatarDataParaUsuario, formatarHorarioParaUsuario, atual, setLinkAtual,
                EnumTipoDespesa, logout, aredondar
            }}>
            {children}
        </UtilsContext.Provider>
    );
}
export default UtilsContext;