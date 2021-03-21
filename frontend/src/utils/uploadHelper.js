export default async function uploadCSV(csvFile, meetingId = null) {
  const formData = new FormData();
  formData.append('csvfile', csvFile);

  const uploadUrl = `http://localhost:3002/upload/${meetingId || ''}`;
  const options = {
    method: meetingId === null ? 'POST' : 'PUT',
    body: formData,
  };

  const response = await fetch(uploadUrl, options);
  return response;
}