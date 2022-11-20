import { FiHelpCircle } from 'react-icons/fi'
import { Button } from 'react-bootstrap';
export default function BtSair({ onClick }) {
    return (
        <div style={{ position: 'absolute', top: '1.5em', right: '2.5em' }}>
            <a href="/centralajuda"><Button className='m-0 p-0 px-1 border-0 bg-transparent btn-dark mr-1'
                data-toggle="tooltip" data-placement="bottom" title="Ajuda">
                <FiHelpCircle size={22} color="black" />
            </Button></a>
            <button type="button" className="btn btn-dark btn-sm" style={{ marginLeft: '1rem' }}
                onClick={onClick}>
                Sair
            </button>
        </div>
    );
}