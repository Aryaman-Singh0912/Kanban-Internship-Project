import React from 'react';
import { Check } from 'lucide-react';

const Card = (props) => {
  let deleteButtonMarkup = null;
  let attachmentInputMarkup = null;
  let attachmentButtonSubmit = null;
  let attachmentLinkMarkup = null;
  let approveButtonMarkup = null;
  let declineButtonMarkup = null;
  let declinePanelMarkup = null;
  let pendingLabelMarkup = null;
  let feedbackMarkup = null;

  const [draftLink, setDraftLink] = React.useState(props.attachment);
  const [showDeclineInput, setShowDeclineInput] = React.useState(false);
  const [declineNote, setDeclineNote] = React.useState("");

  if (props.status === "Approved" && props.canDelete) {
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
        placeholder="Paste Code Link Here"
        value={draftLink}
      />
    );
  }

  if ((props.status === "Under Review" || props.status === "Approved") && props.attachment) {
    attachmentLinkMarkup = (
      <a className="attachment-link" href={props.attachment} target="_blank" rel="noopener noreferrer">
        View Code Submission
      </a>
    );
  }

  const submitDecline = () => {
    props.onDecline(props.id, declineNote);
    setDeclineNote("");
    setShowDeclineInput(false);
  };

  if (props.status === "Under Review") {
    if (props.isAdmin) {
      approveButtonMarkup = (
        <button className="btn btn-approve" onClick={() => props.onApprove(props.id)}>Approve</button>
      );
      declineButtonMarkup = (
        <button className="btn btn-decline" onClick={() => setShowDeclineInput(!showDeclineInput)}>
          Decline
        </button>
      );
      if (showDeclineInput) {
        declinePanelMarkup = (
          <div className="decline-panel">
            <textarea
              className="decline-textarea"
              placeholder="Add feedback for the employee..."
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
            />
            <button className="btn btn-send-back" onClick={submitDecline}>Send Back</button>
          </div>
        );
      }
    } else {
      pendingLabelMarkup = <span className="pending-label">Pending approval</span>;
    }
  }

  if (props.feedback) {
    feedbackMarkup = (
      <div className="feedback-note">
        <strong>Feedback:</strong> {props.feedback}
      </div>
    );
  }

  const statusClassMap = {
    "To-Do": "card-todo",
    "In Progress": "card-progress",
    "Under Review": "card-review",
    "Approved": "card-approved"
  };
  const statusClass = statusClassMap[props.status] || "";

  return (
    <div className={`kanban-card ${statusClass}`}>
      <h3>{props.title}</h3>
      <span className="assignee-badge">{props.assignee}</span>
      {feedbackMarkup}
      <p>{props.description}</p>

      {(attachmentInputMarkup || attachmentButtonSubmit) && (
        <div className="card-actions">
          {attachmentInputMarkup}
          {attachmentButtonSubmit}
        </div>
      )}

      {attachmentLinkMarkup}

      {(approveButtonMarkup || declineButtonMarkup) && (
        <div className="review-actions">
          {approveButtonMarkup}
          {declineButtonMarkup}
        </div>
      )}
      {declinePanelMarkup}
      {pendingLabelMarkup}
      {deleteButtonMarkup}
    </div>
  );
};

export default Card;