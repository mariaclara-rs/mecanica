import { text } from '@fortawesome/fontawesome-svg-core';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useState, useContext } from 'react';
import { DadosContext } from '../context/DadosContext';

function formatarData(data) {
    if (data == "" || data == null)
        return "";
    data = data.split('-');
    return data[2] + '/' + data[1] + '/' + data[0];
}
function aredondar(val) {
    return Math.round(val * 100) / 100
}

function formatMoeda(val) {
    val = val + ""
    if (!val.includes(',') && !val.includes('.'))
        return val + ".00"
    return val;
}

function EmitirClientesInadimplentes(dadosRel, mecanica) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    let textFooter = "";
    if (mecanica != null) {
        if(mecanica.mec_nome!="")   
            textFooter+=mecanica.mec_nome+"\n";
        if(mecanica.mec_endereco!="")
            textFooter+=mecanica.mec_endereco+", ";
        if(mecanica.mec_num!="")
            textFooter+=mecanica.mec_num+" - ";
        if(mecanica.mec_bairro!="")
            textFooter+=mecanica.mec_bairro;
        if(mecanica.mec_cidade!="")
            textFooter+="\n"+mecanica.mec_cidade
    }
    const clientes = dadosRel.map((d) => {
        var fone = d.cli_tel;
        var foneFormat = "";
        if (fone != "" && fone != null)
            foneFormat = "(" + fone.substring(0, 2) + ") " + fone.substring(2, fone.length);
        return [
            { text: d.cli_nome },
            { text: foneFormat },
            { text: d.cli_cpf },
            { text: formatMoeda(aredondar(d.valDevido)) }
        ]
    });
    const header = [{
        text: 'Relátorio de Clientes Inadimplentes',
        fontSize: 15,
        bold: true,
        margin: [40, 20, 20, 0]
    }];
    const content = [{
        text: [
            { text: 'Emitido em: ', bold: true },
            { text: formatarData((new Date()).toISOString().split('T')[0]) }
        ],
        fontSize: 11,
        margin: [0, 5, 20, 20]
    },
    {
        table: {
            widths: ['*', '*', '*', '*'],
            body: [
                [{ text: 'Nome', bold: true }, { text: 'Telefone', bold: true }, { text: 'CPF', bold: true }, { text: 'Valor Devido (R$)', bold: true }],
                ...clientes
            ]
        },
        margin: [0, 10, 0, 10]
    }
    ];

    const doc = {
        pageSize: 'A4',
        header: header,
        background: [{
            image: 'fundo',
            alignment: 'center',
            opacity: 0.2,
            margin: [0, 100, 0, 0]
        }],
        content: [content],
        images: {
            fundo: 'https://media.istockphoto.com/vectors/wrench-and-screwdriver-tools-drawing-vector-id492669132?k=20&m=492669132&s=170667a&w=0&h=00tAGt_sHXbpdWtYPKy2cG_dK7LpMxB2azYh9eAYkhk=',
        },

        footer: {
            columns: [
                {
                    alignment: 'center',
                    text: textFooter,
                    color: 'gray'
                }
            ],
            margin: [0, -25, 0, 0]
        },
        styles: {
            header: {
                fontSize: 12,
                bold: true
            }
        },
        defaultStyle: {
            columnGap: 5
        }
    }
    pdfMake.createPdf(doc).open();
}

export default EmitirClientesInadimplentes;