export default function BtSair({ onClick }) {
    return (
        <button type="button" className="btn btn-dark btn-sm" style={{position: 'absolute', top: '1.5em', right: '2.5em'}}
            onClick={onClick}>
             Sair
        </button>
    );
}