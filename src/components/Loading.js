const Loading = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <i className="fas fa-circle-notch fa-2x fa-spin" style={{ color: 'white' }}></i>
        </div>
      </div>
    </div>
  );
}

export default Loading;