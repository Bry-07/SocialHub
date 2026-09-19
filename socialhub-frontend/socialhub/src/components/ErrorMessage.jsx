function ErrorMessage({ text }) {
  return (
    <div className="alert alert-danger" role="alert">
      {text || 'Ocurrió un error inesperado.'}
    </div>
  );
}

export default ErrorMessage;