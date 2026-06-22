import React from 'react';
import { Check } from 'lucide-react';

const Card = (props) => {
  let deleteButtonMarkup = null;
  let attachmentInputMarkup = null;
  let attachmentButtonSubmit = null;
  let approveButtonMarkup = null;
  let pendingLabelMarkup = null;

  const [draftLink, setDraftLink] = React.useState(props.attachment);

  if (props.status === "Approved") {
    deleteButtonMarkup = (
      <button className="btn btn-delete" onClick={() => props.onDelete(props.id)}>X</button>
    );
  }

  const submitAttachment = () => {
    props.onAddAttachment(props.id, draftLink);
  };

  if (props.status === "To-Do" || props.status === "In Progress") {
    attachmentButtonSubmit = (
      <button className="btn btn-submit-attachment" onClick={submitAttachment}><Check /></button>
    );

    attachmentInputMarkup = (
      <input
        className="card-input"
        type="text"
        onChange={(event) => setDraftLink(event.target.value)}
        placeholder="Paste Code Link"
        value={draftLink}
      />
    );
  }

  if (props.status === "Under Review") {
    if (props.isAdmin) {
      approveButtonMarkup = (
        <button className="btn btn-approve" onClick={() => props.onApprove(props.id)}>Approve</button>
      );
    } else {
      pendingLabelMarkup = <span className="pending-label">Pending approval</span>;
    }
  }

  return (
    <div className="kanban-card">
      <h3>{props.title}</h3>
      <span className="assignee-badge">{props.assignee}</span>
      <p>{props.description}</p>

      {(attachmentInputMarkup || attachmentButtonSubmit) && (
        <div className="card-actions">
          {attachmentInputMarkup}
          {attachmentButtonSubmit}
        </div>
      )}

      {approveButtonMarkup}
      {pendingLabelMarkup}
      {deleteButtonMarkup}
    </div>
  );
};

export default Card;