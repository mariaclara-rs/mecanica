import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

export default function ToastMessage({onClose=null, show, titulo, classes="Danger", msg, position="top-end"}) {
    return (
        <ToastContainer className="p-3" style={{zIndex: '7000'}} position={position}>
            <Toast onClose={onClose} show={show} delay={5500} bg={classes.toLowerCase()} autohide>
                <Toast.Header>
                    <strong className="me-auto">{titulo}</strong>
                </Toast.Header>
                <Toast.Body className={classes}>{msg}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}