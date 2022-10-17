import React, { createContext, useState } from 'react'
import api from '../services/api'

export const DadosContext = createContext();

export default function DadosProvider({ children }) {

    const [clis,setClis] = useState([]);
    const [dists,setDists] = useState([])
    const [veiculos, setVeiculos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [pecas, setPecas] = useState([]);
    const [tpDespesa, setTpDespesa] = useState([]);

    async function carregarTpDespesa(){
      const resp = await api.get('/tpdespesa');
      setTpDespesa(resp.data)
    }
    async function carregarClis(){
        const resp = await api.get('/clientes')
        setClis(resp.data)
    }

    async function carregarDists(){
        const resp = await api.get('/distribuidoras')
        setDists(resp.data)
    }

    async function carregarVeiculos(){
      const resp = await api.get('/veiculos')
      setVeiculos(resp.data)
    }

    async function carregarPecas(){
      const resp = await api.get('/pecas')
      setPecas(resp.data)
    }

    async function carregarServicos(){
      const resp = await api.get('/servicos')
      setServicos(resp.data)
    }

    return (
        <DadosContext.Provider
          value={{
            clis, carregarClis, dists, carregarDists, veiculos, carregarVeiculos,
            servicos, carregarServicos, pecas, carregarPecas, tpDespesa, carregarTpDespesa
          }}>
          {children}
        </DadosContext.Provider>
      );
}