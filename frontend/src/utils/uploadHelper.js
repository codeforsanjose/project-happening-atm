export default async function uploadCSV(csvFile, meetingId = null) {
  const formData = new FormData();
  formData.append('csvfile', csvFile);

  const id = meetingId || '';
  const uploadUrl = `http://localhost:3002/upload/${id}`;
  // TODO: Replace local development url

  const options = {
    method: meetingId === null ? 'POST' : 'PUT',
    body: formData,
  };

  const response = await fetch(uploadUrl, options);
  const data = await response.json();
  return data;
}
