import React from 'react'
import './SubscribeViaText.scss'
import classnames from 'classnames'

function SubscribeViaText({ showTextForm, setShowTextForm }) {
  return (
    <div
      className={classnames('subscribe-via-text-view', {
        hide: !showTextForm,
      })}
    >
      <button onClick={() => setShowTextForm(false)}>Back</button>
      <h1>Enter Phone Number</h1>
      <p>Receive text message notifications for this agenda item.</p>
      <input type="tel" />
      <button>Subscribe</button>
    </div>
  )
}

export default SubscribeViaText
