interface ContactEmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  projectType: string[];
}

const ContactFormEmail = ({
  name,
  email,
  phone,
  projectType,
}: ContactEmailTemplateProps) => {
  return (
    <div>
      <div>
        <h1>Hello, {name}</h1>
        <p>Thanks for reaching out!</p>

        <div>
          <h2>You wanted to contact us about</h2>
          <p>{projectType}</p>
        </div>

        <div>
          <h2>Your contact details are as follows</h2>
          <p>{email}</p>
          <p>{phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactFormEmail;
