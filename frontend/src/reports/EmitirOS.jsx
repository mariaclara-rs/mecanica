import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { IoMdGrid } from 'react-icons/io';


function totalServicos(servicos){
    var soma=0;
    servicos.map((ser)=>{
        soma+=ser.serOS_val;
    })
    return soma;
}
function totalPecas(pecas){
    var soma=0;
    pecas.map((pec)=>{
        soma+=pec.pecOS_valTot;
    })
    return soma;
}
function formatarData(data){
    data = (data.split('T')[0]).split('-');
    return data[2]+'/'+data[1]+'/'+data[0];
}
function situacao(status){
    if(status=='A')
        return {text: "Em aberta", color:'red',width:'auto'};
    return {text:"Encerrada", color:'green',width:'auto'};
}
function fechamento(ordemservico){
    if(ordemservico.os_dataFechamento!=null){
        var dtFechamento = formatarData(ordemservico.os_dataFechamento);
        return [{
            columns: [
                {
                    width: 'auto',
                    text: 'Data de Fechamento:',
                    style: 'header'
                },
                {
                    width: '*',
                    text: dtFechamento
                }
            ]
        },
        {
            table: {
                widths: ['*', '*','*','*'],
                body: [
                    [{text: 'Método de Recebimento:', style: 'header'}, metodoRecebimento(ordemservico.os_metodoReceb),
                     {text: 'Quantidade de Parcelas', style: 'header'},ordemservico.os_qtdeParcelas],
                    
                    [{text: 'Valor Recebido:',style:'header'}, ordemservico.os_valTot-ordemservico.os_valFiado,
                     {text: 'Valor fiado:',style:'header'}, ordemservico.os_valFiado]
                ]
            },
            margin: [0,10,0,10] 
        },
        {text: 'Anotações:',style:'header'},
        {columns: [
            {
                alignment: 'justify',
                italics: true,
                text: ordemservico.os_observacoes,
            }]
        }
    ]
    }
}
function metodoRecebimento(metodo){
    if(metodo=="CC")
        return "Cartão de crédito";
    if(metodo=="CD")
        return "Cartão de débito";
    if(metodo=="D")
        return "Dinheiro";
    if(metodo=="P")
        return "PIX";
    return "Cheque";
}
function ffooter(){
    return [{
        text: 'Auto Mecânica Valter\nAv. Ana Jacinta, 2652 - Núcleo Bartolomeu B. de Miranda\nPresidente Prudente - SP',
        alignment: 'center',
        fontSize: 11,
        color: 'gray',
        padding: [5,5,5,50]
    }];
}
function EmitirOS(ordemservico, servicos, pecas){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const dataservicos = servicos.map((s)=>{
        return [
            {text: s.ser_nome},
            {text: s.serOS_val}
        ]
    });
    const datapecas = pecas.map((p)=>{
        return [
            {text: p.pec_nome},
            {text: p.pecOS_qtde},
            {text: (p.pecOS_valTot/p.pecOS_qtde)},
            {text: p.pecOS_valTot}
        ]
    })
    const header = [{
        text: 'Ordem de Serviço #'+ordemservico.os_id,
        fontSize: 15,
        bold: true,
        margin: [40,20,20,20] //left, top, right e bottom
    }];
    const content = [
        {
			columns: [
				{
                    alignment: 'left',
                    width: 'auto',
					text: 'Data de abertura:',
                    style: 'header'
                },
				{
                    width: '*',
					text: formatarData(ordemservico.os_dataAbertura)
				},
                {
                    alignment: 'right',
                    width: '*',
					text: 'Situação:',
                    style: 'header'
                },
				situacao(ordemservico.os_status)
			]
        },
        {
            table: {
                widths: ['auto', '*'],
                body: [
                    [{text: 'Cliente:', style: 'header'}, ordemservico.cli_nome],
                ]
            },
            margin: [0,10,0,10] 
		},
        {text:'Veículo', style:'header'},
        {
			table: {
				widths: ['*', '*'],
				body: [
					['Placa', 'Kilometragem (Km)'],
					[ordemservico.ve_placa,ordemservico.os_vekm]
				]
			},
            margin: [0,0,0,10]
		},
        {text:'Serviços', style:'header'},
        {
            table:{
                widths: ['*', '*'],
                body: [
                    ['Nome','Valor (R$)'],
                    ...dataservicos
                ]
            }
        },
        {
            table:{
                widths: ['auto','*'],
                body: [
                    [{text:'Total',border: [true, false, true, true]},
                    {text: totalServicos(servicos),  border: [true, false, true, true]}]
                ]
            },
            margin: [0,0,0,10]
        },
        {text:'Peças', style:'header'},
        {
            table:{
                widths: ['*','*','*','*'],
                body: [
                    ['Nome','Quantidade','Valor Unitário','Valor Total'],
                    ...datapecas
                ]
            }
        },
        {
            table:{
                widths: ['auto','*'],
                body: [
                    [{text:'Total', border: [true, false, true, true]},
                    {text:totalPecas(pecas), border: [true, false, true, true]}]
                ]
            },
            margin: [0,0,0,10]
        },
        {
			columns: [
				{
                    width: 'auto',
					text: 'Valor Total da O.S.:',
                    style: 'header'
                },
				{
                    width: '*',
					text: ordemservico.os_valTot
				}
			],
            margin: [0,2,0,5]
        },
        fechamento(ordemservico)
        
    ];
    const footer = [ffooter()];

    const doc = {
        pageSize: 'A4',
        header: [header],
        background: [{
            image: 'snow',
            alignment: 'center',
            opacity: 0.2,
            margin: [0,100,0,0]
        }],
        content: [content],
        images: {
            mySuperImage: 'data:image/jpeg;base64,...content...',
        
            // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
            snow: 'https://media.istockphoto.com/vectors/wrench-and-screwdriver-tools-drawing-vector-id492669132?k=20&m=492669132&s=170667a&w=0&h=00tAGt_sHXbpdWtYPKy2cG_dK7LpMxB2azYh9eAYkhk='
        
          },

        footer: {
            columns: [ 
                { 
                    alignment: 'center',
                    text: 'Auto Mecânica Valter\nAv. Ana Jacinta, 2652 - Núcleo Bartolomeu B. de Miranda\nPresidente Prudente - SP',
                    color: 'gray'
                }
            ],
            margin: [0,-25,0,0]
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
export default EmitirOS;