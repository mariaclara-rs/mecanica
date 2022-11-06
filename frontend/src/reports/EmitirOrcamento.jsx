import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function calcularDesconto(){

}

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

function EmitirOS(ordemservico, servicos, pecas){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var desc = 0;
    var orig = 0;
    const dataservicos = servicos.map((s)=>{
        var precoReal = Number(s.ser_maoObra);
        var precoCobrado = Number(s.serOS_val/s.serOS_qtde)
        desc+=(precoReal-precoCobrado)*s.serOS_qtde;
        orig+=precoReal*s.serOS_qtde;
        return [
            {text: s.ser_nome},
            {text: s.ser_maoObra},
            {text: s.ser_maoObra-(s.serOS_val/s.serOS_qtde)},
            {text: s.serOS_val}
        ]
    });
    const datapecas = pecas.map((p)=>{
        var precoReal = Number(p.pec_preco);
        var precoCobrado = Number(p.pecOS_valTot/p.pecOS_qtde)
        desc+=(precoReal-precoCobrado)*p.pecOS_qtde;
        orig+=precoReal*p.pecOS_qtde;
        return [
            {text: p.pec_nome},
            {text: p.pec_preco},
            {text: p.pec_preco-(p.pecOS_valTot/p.pecOS_qtde)},
            {text: (p.pecOS_valTot/p.pecOS_qtde)},
            {text: p.pecOS_qtde},
            {text: p.pecOS_valTot}
        ]
    })
    console.log("desc: "+desc+" orig: "+orig)
    const header = [{
        text: 'Orçamento #'+ordemservico.os_id,
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
					text: 'Data do orçamento:',
                    style: 'header'
                },
				{
                    width: '*',
					text: formatarData(ordemservico.os_dataAbertura)
				}
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
        {text:'Serviços', style:'header'},
        {
            table:{
                widths: ['*', '*','*','*'],
                body: [
                    ['Nome','Valor','Desconto','Valor Final'],
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
                widths: ['*','*','*','*','*','*'],
                body: [
                    ['Nome','Valor Unitário','Desconto','Valor Final','Quantidade','Valor Total'],
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
					text: 'Valor Total:',
                    style: 'header'
                },
				{
                    width: '*',
					text: orig
				}
			],
            margin: [0,2,0,5]
        },
        {
			columns: [
				{
                    width: 'auto',
					text: 'Descontos:',
                    style: 'header'
                },
				{
                    width: '*',
					text: desc
				}
			],
            margin: [0,2,0,5]
        },
        {
			columns: [
				{
                    width: 'auto',
					text: 'Valor Final:',
                    style: 'header'
                },
				{
                    width: '*',
					text: ordemservico.os_valTot
				}
			],
            margin: [0,2,0,5]
        }
        
    ];

    const doc = {
        pageSize: 'A4',
        header: [header],
        background: [{
            image: 'fundo',
            alignment: 'center',
            opacity: 0.2,
            margin: [0,100,0,0]
        }],
        content: [content],
        images: {
            fundo: 'https://media.istockphoto.com/vectors/wrench-and-screwdriver-tools-drawing-vector-id492669132?k=20&m=492669132&s=170667a&w=0&h=00tAGt_sHXbpdWtYPKy2cG_dK7LpMxB2azYh9eAYkhk=',
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