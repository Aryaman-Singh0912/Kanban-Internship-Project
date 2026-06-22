function Column(props) {
  return (
    <div className="kanban-column">
      <h2 className="column-title">{props.title}</h2>
      <div className="card-list">
        {props.children}
      </div>
    </div>
  );
}

export default Column;