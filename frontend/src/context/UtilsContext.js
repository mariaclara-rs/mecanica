import React, { createContext, useState } from 'react'

export const UtilsContext = createContext();

export function UtilsProvider({ children }) {

    const [msgForm, setMsgForm] = useState('');
    const [classes, setClasses] = useState('');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function alerta(cls, msg) {
        setClasses(cls)
        setMsgForm(msg);
        await sleep(2500);
        setMsgForm('');
    }

    function formatarDataParaUsuario(data) {
        data = data.split('-')
        return data[2] + '/' + data[1] + '/' + data[0]
    }


    function formatarHorarioParaUsuario(horario) {
        return horario.substring(0, 5)
    }

    return (
        <UtilsContext.Provider
            value={{ sleep, alerta, msgForm, setMsgForm, classes, setClasses, formatarDataParaUsuario, formatarHorarioParaUsuario }}>
            {children}
        </UtilsContext.Provider>
    );
}
export default UtilsContext;