function Column(props) {
  const variantClass = props.variant ? `kanban-column--${props.variant}` : "";
  const titleVariantClass = props.variant ? ` column-title--${props.variant}` : "";
  const widthClass = props.fullWidth ? "kanban-column--full" : "";
  const columnClass = ["kanban-column", variantClass, widthClass].filter(Boolean).join(" ");

  return (
    <div className={columnClass}>
      <h2 className={`column-title${titleVariantClass}`}>{props.title}</h2>
      <div className="card-list">
        {props.children}
      </div>
    </div>
  );
}

export default Column;