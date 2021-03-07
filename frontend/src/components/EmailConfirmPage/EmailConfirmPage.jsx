import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { CONFIRM_EMAIL, UNCONFIRM_EMAIL } from '../../graphql/graphql';

function EmailConfirmPage() {
  const { token, action } = useParams();
  const validActions = new Set(['subscribe', 'unsubscribe']);

  const currentMutation = action === 'subscribe' ? CONFIRM_EMAIL : UNCONFIRM_EMAIL;
  const [callMutation, { loading, error, data }] = useMutation(currentMutation);

  if (!validActions.has(action)) return <Redirect to="/" />;
  if (loading) return 'Loading...';
  if (error) return `An error occured: ${error}`;

  return (
    <div className="EmailConfirmPage">
      <p>
        {
          action === 'subscribe'
            ? 'Confirm email subscription'
            : 'Unsubscribe from email notification'
        }
      </p>

      <button
        type="submit"
        onClick={() => callMutation(token)}
      >
        {
          action === 'subscribe'
            ? 'Confirm Email'
            : 'Unsubscribe'
        }
      </button>

      {/* DEBUG */}
      <div style={{width: '600px', margin: '20px auto', backgroundColor: '#eee', color: '#361515', padding: '10px 20px', border: '1px solid #aaa'}}>
        <p>{`Action: ${action}`}</p>
        <p>{`Token: ${token}`}</p>
        <p>Data:</p>
        <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
      </div>
      {/* END DEBUG */}
    </div>
  );
}

export default EmailConfirmPage;
