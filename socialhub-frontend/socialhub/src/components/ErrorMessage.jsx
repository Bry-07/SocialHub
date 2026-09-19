function ErrorMessage({ text }) {
  return (
    <div className="alert alert-danger" role="alert">
      {text || 'La respuesta recibida no tiene el formato esperado.'}
    </div>
  );
}

export default ErrorMessage;