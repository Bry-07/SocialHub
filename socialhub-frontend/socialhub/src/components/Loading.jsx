function Loading({ text }) {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2">{text || 'Cargando...'}</p>
    </div>
  );
}

export default Loading;