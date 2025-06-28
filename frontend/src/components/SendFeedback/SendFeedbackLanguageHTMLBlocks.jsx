export default (language = "en") => {
  const allLanguages = {
    en: (
      <>
        <h1>Send Feedback</h1>
        <p>
          We&apos;re eager to receive feedback from our community - feedback is a
          present which helps us improve. If you have any suggestions, send us
          an email at <span className="email-text">shareadmin@codeforsanjose.org</span>.
        </p>
      </>
    ),
    es: <></>,
  };
  return allLanguages[language];
};
