
export default function BtAdicionar({ onClick }) {
    return (
        <>
        <button type="button" className="btn btn-dark" data-toggle="modal"
            onClick={onClick}>
            ?
        </button>
        <button type="button" className="btn btn-dark" data-toggle="modal"
            onClick={onClick}>
            Adicionar +
        </button>
        </>
    );
}